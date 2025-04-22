import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { getDatabaseName, getCollection } from '../db/mongodb';

export interface UserDocument {
    _id?: ObjectId;
    email: string;
    password?: string;
    name: string;
    image?: string;
    provider?: string;
    providerId?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Collection name
const COLLECTION = 'users';

// Get database name from connection string
const DB_NAME = getDatabaseName();

// User helper functions
export const UserService = {
    // Find a user by email
    findByEmail: async (email: string) => {
        const collection = await getCollection(DB_NAME, COLLECTION);
        return collection.findOne({ email: email.toLowerCase() }) as Promise<UserDocument | null>;
    },

    // Find a user by ID
    findById: async (id: string) => {
        const collection = await getCollection(DB_NAME, COLLECTION);
        return collection.findOne({ _id: new ObjectId(id) }) as Promise<UserDocument | null>;
    },

    // Find a user by provider ID
    findByProviderId: async (providerId: string) => {
        const collection = await getCollection(DB_NAME, COLLECTION);
        return collection.findOne({ providerId }) as Promise<UserDocument | null>;
    },

    // Create a new user
    create: async (userData: Omit<UserDocument, '_id' | 'createdAt' | 'updatedAt'>) => {
        const collection = await getCollection(DB_NAME, COLLECTION);

        // Hash password if provided
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

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

    // Update a user
    update: async (id: string, userData: Partial<UserDocument>) => {
        const collection = await getCollection(DB_NAME, COLLECTION);

        // Don't allow updating these fields directly
        const { _id, createdAt, ...updateData } = userData as any;

        // Hash password if it's being updated
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    },

    // Verify password
    verifyPassword: async (plainPassword: string, hashedPassword: string) => {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
};