import { ObjectId } from 'mongodb';
// import bcrypt from 'bcryptjs';
import { getDatabaseName, getCollection } from '../mongodb';
import { hashPassword } from '$lib/server/migrations/password';
import { generateRandomRecoveryCode } from '$lib/server/migrations/utils';
import { encryptString } from '$lib/server/migrations/encryption';

export interface UserDocument {
    _id?: ObjectId;
    email: string;
    password?: string;
    username: string;
    image?: string;
    provider?: string;
    recoveryCode?: Uint8Array;
    providerId?: string;
    createdAt: Date;
    updatedAt: Date;
    emailVerified: boolean;
    registered2FA: boolean;
}

const COLLECTION = 'users';
const DB_NAME = getDatabaseName();

export const UserService = {
    verifyUsernameInput: (username: string): boolean => {
        return username.length > 3 && username.length < 32 && username.trim() === username;
    },
    findByEmail: async (email: string) => {
        const collection = await getCollection(DB_NAME, COLLECTION);
        return collection.findOne({ email: email.toLowerCase() }) as Promise<UserDocument | null>;
    },

    findById: async (id: string) => {
        const collection = await getCollection(DB_NAME, COLLECTION);
        return collection.findOne({ _id: new ObjectId(id) }) as Promise<UserDocument | null>;
    },

    findByProviderId: async (providerId: string) => {
        const collection = await getCollection(DB_NAME, COLLECTION);
        return collection.findOne({ providerId }) as Promise<UserDocument | null>;
    },

    create: async (userData: Omit<UserDocument, '_id' | 'createdAt' | 'updatedAt'>) => {
        const collection = await getCollection(DB_NAME, COLLECTION);

        if (userData.password) {
            userData.password = await hashPassword(userData.password);
        }

        userData.recoveryCode = encryptString(generateRandomRecoveryCode());

        const now = new Date();
        const newUser = {
            ...userData,
            email: userData.email.toLowerCase(),
            createdAt: now,
            updatedAt: now
        };

        const result = await collection.insertOne(newUser);
        return { _id: result.insertedId, ...newUser };
    },

    update: async (_id: ObjectId, userData: Partial<UserDocument>) => {
        const collection = await getCollection(DB_NAME, COLLECTION);
        const { createdAt, ...updateData } = userData as any;

        if (updateData.password) {
            updateData.password = await hashPassword(updateData.password);
        }

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

    verifyPassword: async (plainPassword: string, hashedPassword: string) => {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
};