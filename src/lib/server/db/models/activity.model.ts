import { ObjectId } from 'mongodb';
import { getDatabaseName, getCollection } from '../mongodb';

export interface ActivityDocument {
    _id?: ObjectId;
    userId: ObjectId;
    title: string;
    description: string;
    location?: string;
    duration: string;
    category: 'internship' | 'course' | 'travel' | 'volunteering' | "research" | "workshop" | "hackathon" | 'other';
    major?: {
        _id: string;
        title: string;
    };
    requirements?: {
        _id: string;
        title: string;
    }[];
    cost?: number;
    recommended?: number;
    goodForWho?: string;
    link?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Activity {
    id: string;
    userId: string;
    title: string;
    description: string;
    location?: string;
    duration: string;
    category: 'internship' | 'course' | 'travel' | 'volunteering' | "research" | "workshop" | "hackathon" | 'other';
    major?: {
        id: string;
        title: string;
    };
    requirements?: {
        id: string;
        title: string;
    }[];
    cost?: number;
    recommended?: number;
    goodForWho?: string;
    link?: string;
    createdAt: Date;
    updatedAt: Date;
}

const COLLECTION = 'activities';
const DB_NAME = getDatabaseName();

export const ActivityService = {
    findByUserId: async (userId: ObjectId) => {
        const collection = await getCollection(DB_NAME, COLLECTION);
        return collection.find({
            userId: userId
        }).sort({ createdAt: -1 }).toArray() as Promise<ActivityDocument[]>;
    },

    findAll: async (): Promise<Activity[]> => {
        const collection = await getCollection<ActivityDocument>(DB_NAME, COLLECTION);
        const activities = await collection.find({}).sort({ createdAt: -1 }).toArray();

        const formattedActivities: Activity[] = activities.map(({ _id, userId, major, requirements, ...rest }) => {
            return {
                ...rest,
                id: _id.toString(),
                userId: userId.toString(),
                major: major ? {
                    id: major._id,
                    title: major.title
                } : undefined,
                requirements: requirements ? requirements.map(req => ({
                    id: req._id,
                    title: req.title
                })) : undefined
            };
        });

        return formattedActivities;
    },

    findById: async (id: string) => {
        const collection = await getCollection(DB_NAME, COLLECTION);
        const query: any = { _id: new ObjectId(id) };

        return collection.findOne(query) as Promise<ActivityDocument | null>;
    },

    create: async (activityData: Omit<ActivityDocument, '_id' | 'createdAt' | 'updatedAt'>) => {
        const collection = await getCollection(DB_NAME, COLLECTION);

        if (activityData.userId && typeof activityData.userId === 'string') {
            activityData.userId = new ObjectId(activityData.userId);
        }

        const major = activityData.major ? {
            _id: activityData.major._id,
            title: activityData.major.title
        } : undefined;

        const requirements = activityData.requirements ?
            activityData.requirements.map(req => ({
                _id: req._id,
                title: req.title
            })) : undefined;

        const now = new Date();
        const newActivity = {
            ...activityData,
            major,
            requirements,
            createdAt: now,
            updatedAt: now
        };

        const result = await collection.insertOne(newActivity);
        return { _id: result.insertedId, ...newActivity };
    },

    update: async (id: string, userId: string, activityData: Partial<ActivityDocument>) => {
        const collection = await getCollection(DB_NAME, COLLECTION);

        const { _id, createdAt, userId: dataUserId, ...updateData } = activityData as any;

        // Format major field if it's provided
        if (updateData.major) {
            updateData.major = {
                _id: updateData.major._id,
                title: updateData.major.title
            };
        }

        // Format requirements field if it's provided
        if (updateData.requirements) {
            updateData.requirements = updateData.requirements.map((req: { _id: any; title: any; }) => ({
                _id: req._id,
                title: req.title
            }));
        }

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

    delete: async (id: string, userId: string) => {
        const collection = await getCollection(DB_NAME, COLLECTION);

        const result = await collection.deleteOne({
            _id: new ObjectId(id),
            userId: new ObjectId(userId)
        });

        return result.deletedCount > 0;
    },

    findByFilters: async (filters: {
        category?: string;
        majorId?: string;
        search?: string;
    }): Promise<Activity[]> => {
        const collection = await getCollection<ActivityDocument>(DB_NAME, COLLECTION);

        const query: any = {};

        if (filters.category) {
            query.category = filters.category;
        }

        if (filters.majorId) {
            query["major._id"] = filters.majorId;
        }

        if (filters.search) {
            query.$or = [
                { title: { $regex: filters.search, $options: 'i' } },
                { description: { $regex: filters.search, $options: 'i' } }
            ];
        }

        const activities = await collection.find(query).sort({ createdAt: -1 }).toArray();

        return activities.map(({ _id, userId, major, requirements, ...rest }) => ({
            ...rest,
            id: _id.toString(),
            userId: userId.toString(),
            major: major ? {
                id: major._id,
                title: major.title
            } : undefined,
            requirements: requirements ? requirements.map(req => ({
                id: req._id,
                title: req.title
            })) : undefined
        }));
    }
};
