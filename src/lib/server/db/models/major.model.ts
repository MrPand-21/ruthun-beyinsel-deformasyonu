import { ObjectId } from 'mongodb';
import { getDatabaseName, getCollection } from '../mongodb';

export interface MajorDocument {
    _id?: ObjectId;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Major {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

const COLLECTION = 'majors';
const DB_NAME = getDatabaseName();

export const MajorService = {
    findAll: async (): Promise<Major[]> => {
        const collection = await getCollection<MajorDocument>(DB_NAME, COLLECTION);
        const majors = await collection.find({}).sort({ title: 1 }).toArray();

        return majors.map(({ _id, ...rest }) => ({
            ...rest,
            id: _id.toString()
        }));
    },

    findById: async (id: string): Promise<Major | null> => {
        const collection = await getCollection<MajorDocument>(DB_NAME, COLLECTION);
        const major = await collection.findOne({ _id: new ObjectId(id) });

        if (!major) return null;

        return {
            ...major,
            id: major._id.toString()
        };
    },

    create: async (title: string): Promise<Major> => {
        const collection = await getCollection<MajorDocument>(DB_NAME, COLLECTION);
        const now = new Date();

        const newMajor: MajorDocument = {
            title,
            createdAt: now,
            updatedAt: now
        };

        const result = await collection.insertOne(newMajor);

        return {
            ...newMajor,
            id: result.insertedId.toString()
        };
    },

    update: async (id: string, title: string): Promise<boolean> => {
        const collection = await getCollection<MajorDocument>(DB_NAME, COLLECTION);

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    title,
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    },

    delete: async (id: string): Promise<boolean> => {
        const collection = await getCollection<MajorDocument>(DB_NAME, COLLECTION);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        return result.deletedCount > 0;
    }
};