import { ObjectId } from 'mongodb';
import { getDatabaseName, getCollection } from '../mongodb';

export interface RequirementDocument {
    _id?: ObjectId;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Requirement {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

const COLLECTION = 'requirements';
const DB_NAME = getDatabaseName();

export const RequirementService = {
    findAll: async (): Promise<Requirement[]> => {
        const collection = await getCollection<RequirementDocument>(DB_NAME, COLLECTION);
        const requirements = await collection.find({}).sort({ title: 1 }).toArray();

        return requirements.map(({ _id, ...rest }) => ({
            ...rest,
            id: _id.toString()
        }));
    },

    findById: async (id: string): Promise<Requirement | null> => {
        const collection = await getCollection<RequirementDocument>(DB_NAME, COLLECTION);
        const requirement = await collection.findOne({ _id: new ObjectId(id) });

        if (!requirement) return null;

        return {
            ...requirement,
            id: requirement._id.toString()
        };
    },

    create: async (title: string): Promise<Requirement> => {
        const collection = await getCollection<RequirementDocument>(DB_NAME, COLLECTION);
        const now = new Date();

        const newRequirement: RequirementDocument = {
            title,
            createdAt: now,
            updatedAt: now
        };

        const result = await collection.insertOne(newRequirement);

        return {
            ...newRequirement,
            id: result.insertedId.toString()
        };
    },

    update: async (id: string, title: string): Promise<boolean> => {
        const collection = await getCollection<RequirementDocument>(DB_NAME, COLLECTION);

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
        const collection = await getCollection<RequirementDocument>(DB_NAME, COLLECTION);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        return result.deletedCount > 0;
    }
};