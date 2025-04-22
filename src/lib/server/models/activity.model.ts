import { ObjectId } from 'mongodb';
import { getDatabaseName, getCollection } from '../db/mongodb';

export interface ActivityDocument {
    _id?: ObjectId;
    title: string;
    description: string;
    location?: string;
    startDate: Date;
    endDate: Date;
    category: 'internship' | 'course' | 'travel' | 'volunteering' | 'other';
    tags: string[];
    userId: ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}

// Collection name
const COLLECTION = 'activities';

// Get database name from connection string
const DB_NAME = getDatabaseName();

// Activity helper functions
export const ActivityService = {
    // Find all activities for a user
    findByUserId: async (userId: string) => {
        const collection = await getCollection(DB_NAME, COLLECTION);
        return collection.find({
            userId: new ObjectId(userId)
        }).sort({ createdAt: -1 }).toArray() as Promise<ActivityDocument[]>;
    },

    // Find a specific activity by ID
    findById: async (id: string, userId?: string) => {
        const collection = await getCollection(DB_NAME, COLLECTION);
        const query: any = { _id: new ObjectId(id) };

        // If userId is provided, restrict to user's activities
        if (userId) {
            query.userId = new ObjectId(userId);
        }

        return collection.findOne(query) as Promise<ActivityDocument | null>;
    },

    // Create a new activity
    create: async (activityData: Omit<ActivityDocument, '_id' | 'createdAt' | 'updatedAt'>) => {
        const collection = await getCollection(DB_NAME, COLLECTION);

        // Ensure userId is an ObjectId
        const userId = typeof activityData.userId === 'string'
            ? new ObjectId(activityData.userId)
            : activityData.userId;

        const now = new Date();
        const newActivity = {
            ...activityData,
            userId,
            createdAt: now,
            updatedAt: now
        };

        const result = await collection.insertOne(newActivity);
        return { _id: result.insertedId, ...newActivity };
    },

    // Update an activity
    update: async (id: string, userId: string, activityData: Partial<ActivityDocument>) => {
        const collection = await getCollection(DB_NAME, COLLECTION);

        // Don't allow updating these fields directly
        const { _id, createdAt, userId: dataUserId, ...updateData } = activityData as any;

        const result = await collection.updateOne(
            {
                _id: new ObjectId(id),
                userId: new ObjectId(userId)
            },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    },

    // Delete an activity
    delete: async (id: string, userId: string) => {
        const collection = await getCollection(DB_NAME, COLLECTION);

        const result = await collection.deleteOne({
            _id: new ObjectId(id),
            userId: new ObjectId(userId)
        });

        return result.deletedCount > 0;
    }
};
