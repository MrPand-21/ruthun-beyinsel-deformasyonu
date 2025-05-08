import { ObjectId } from 'mongodb';
import { getDatabaseName, getCollection } from '../mongodb';
import type { Nullable } from '$lib/types';
import { decrypt, decryptToString, encryptString, generateRandomRecoveryCode, hashPassword } from '$lib/server/utils';

export interface UserDocument {
    _id?: ObjectId;
    email: string;
    username: string;
    image?: string;

    passwordHash?: string;
    emailVerified: boolean;
    recoveryCode?: Uint8Array;
    totpKey: Nullable<Uint8Array>;
    provider?: string;
    providerId?: string;
}

export interface User {
    _id: ObjectId;
    email: string;
    username: string;
    emailVerified: boolean;
    registered2FA: boolean;
}

const COLLECTION = 'users';
const DB_NAME = getDatabaseName();

export const UserService = {
    verifyUsernameInput: (username: string): boolean => {
        return username.length > 3 && username.length < 32 && username.trim() === username;
    },
    create: async (userData: Omit<UserDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
        const collection = await getCollection(DB_NAME, COLLECTION);

        if (userData.passwordHash) {
            userData.passwordHash = await hashPassword(userData.passwordHash);
        }

        userData.recoveryCode = encryptString(generateRandomRecoveryCode());
        userData.emailVerified = false;
        userData.totpKey = null;

        const result = await collection.insertOne({
            ...userData,
            email: userData.email.toLowerCase(),
        });

        return {
            _id: result.insertedId,
            username: userData.username,
            email: userData.email,
            emailVerified: false,
            registered2FA: false
        };
    },
    update: async (_id: ObjectId, userData: Partial<UserDocument>) => {
        const collection = await getCollection<UserDocument>(DB_NAME, COLLECTION);
        const { createdAt, ...updateData } = userData as any;

        if (updateData.passwordHash) updateData.passwordHash = await hashPassword(updateData.passwordHash);

        const result = await collection.updateOne(
            { _id },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    },
    findByEmail: async (email: string): Promise<Nullable<User>> => {
        const collection = await getCollection<UserDocument>(DB_NAME, COLLECTION);
        const user = await collection.findOne({ email: email.toLowerCase() });
        return user as Nullable<User>;
    },

    findById: async (_id: ObjectId): Promise<Nullable<User>> => {
        const collection = await getCollection<UserDocument>(DB_NAME, COLLECTION);
        const user = await collection.findOne({ _id });
        return user as Nullable<User>;
    },
    getUserRecoverCode: async (_id: ObjectId): Promise<Nullable<string>> => {
        const collection = await getCollection<UserDocument>(DB_NAME, COLLECTION);
        const user = await collection.findOne({ _id });
        if (!user || !user.recoveryCode) {
            return null
        }
        return decryptToString(user.recoveryCode);
    },
    getUserPasswordHash: async (_id: ObjectId): Promise<Nullable<string>> => {
        const collection = await getCollection<UserDocument>(DB_NAME, COLLECTION);
        const user = await collection.findOne({ _id }, { projection: { passwordHash: 1 } });
        if (!user || !user.passwordHash) return null;
        return user.passwordHash;
    },
    getUserTOTPKey: async (_id: ObjectId): Promise<Nullable<Uint8Array>> => {
        const collection = await getCollection<UserDocument>(DB_NAME, COLLECTION);
        const user = await collection.findOne({ _id }, { projection: { totpKey: 1 } });
        if (!user || !user.totpKey) {
            return null
        }
        return decrypt(user.totpKey);
    },
    resetUserRecoveryCode: async (_id: ObjectId): Promise<Nullable<string>> => {
        const recoveryCode = generateRandomRecoveryCode();
        const collection = await getCollection<UserDocument>(DB_NAME, COLLECTION);
        const result = await collection.updateOne(
            { _id },
            {
                $set: {
                    recoveryCode: encryptString(recoveryCode),
                }
            })
        return recoveryCode;
    },
    checkEmailAvailability: async (email: string): Promise<boolean> => {
        const collection = await getCollection<UserDocument>(DB_NAME, COLLECTION);
        const user = await collection.findOne({ email: email.toLowerCase() });
        return !user;
    }
}