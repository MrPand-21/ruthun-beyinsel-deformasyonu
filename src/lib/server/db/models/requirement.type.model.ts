import { ObjectId } from 'mongodb';
import { getDatabaseName, getCollection } from '../mongodb';

export type RequirementType = 'language' | 'test' | 'grade';

export interface RequirementTypeDocument {
    _id?: ObjectId;
    type: RequirementType;
    name: string;
    value: string | number;
    details?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RequirementTypeModel {
    id: string;
    type: RequirementType;
    name: string;
    value: string | number;
    details?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Language requirement specific interfaces
export interface LanguageRequirement {
    name: string;       // e.g., "English", "French", etc.
    level: string;      // e.g., "B2", "C1", "Fluent", etc.
    details?: string;   // Additional information
}

// Test requirement specific interfaces
export interface TestRequirement {
    name: string;       // e.g., "TOEFL", "GRE", "SAT", etc.
    score: number;      // Minimum required score
    details?: string;   // Additional information
}

// Grade requirement specific interfaces
export interface GradeRequirement {
    type: string;       // e.g., "GPA", "Class Standing", etc.
    value: string | number;  // e.g., "3.0", "Top 10%", etc.
    details?: string;   // Additional information
}

const COLLECTION = 'requirement_types';
const DB_NAME = getDatabaseName();

export const RequirementTypeService = {
    findAll: async (type?: RequirementType): Promise<RequirementTypeModel[]> => {
        const collection = await getCollection<RequirementTypeDocument>(DB_NAME, COLLECTION);
        const query = type ? { type } : {};
        const requirementTypes = await collection.find(query).sort({ type: 1, name: 1 }).toArray();

        return requirementTypes.map(({ _id, ...rest }) => ({
            ...rest,
            id: _id.toString()
        }));
    },

    findById: async (id: string): Promise<RequirementTypeModel | null> => {
        const collection = await getCollection<RequirementTypeDocument>(DB_NAME, COLLECTION);
        const requirementType = await collection.findOne({ _id: new ObjectId(id) });

        if (!requirementType) return null;

        return {
            ...requirementType,
            id: requirementType._id.toString()
        };
    },

    create: async (data: Omit<RequirementTypeDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<RequirementTypeModel> => {
        const collection = await getCollection<RequirementTypeDocument>(DB_NAME, COLLECTION);
        const now = new Date();

        const newRequirementType: RequirementTypeDocument = {
            ...data,
            createdAt: now,
            updatedAt: now
        };

        const result = await collection.insertOne(newRequirementType);

        return {
            ...newRequirementType,
            id: result.insertedId.toString()
        };
    },

    update: async (id: string, data: Partial<Omit<RequirementTypeDocument, '_id' | 'createdAt' | 'updatedAt'>>): Promise<boolean> => {
        const collection = await getCollection<RequirementTypeDocument>(DB_NAME, COLLECTION);

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...data,
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    },

    delete: async (id: string): Promise<boolean> => {
        const collection = await getCollection<RequirementTypeDocument>(DB_NAME, COLLECTION);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        return result.deletedCount > 0;
    },

    // Specialized methods for each requirement type
    findLanguageRequirements: async (): Promise<RequirementTypeModel[]> => {
        return RequirementTypeService.findAll('language');
    },

    findTestRequirements: async (): Promise<RequirementTypeModel[]> => {
        return RequirementTypeService.findAll('test');
    },

    findGradeRequirements: async (): Promise<RequirementTypeModel[]> => {
        return RequirementTypeService.findAll('grade');
    }
};