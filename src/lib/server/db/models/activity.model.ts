import { ObjectId } from 'mongodb';
import { getDatabaseName, getCollection } from '../mongodb';
import type { RequirementType } from './requirement.type.model';

export interface ActivityDocument {
    _id?: ObjectId;
    userId: ObjectId;
    title: string;
    description: string;
    location?: string;
    duration: string;
    year?: number; // Academic year or start year
    category: 'internship' | 'course' | 'travel' | 'volunteering' | "research" | "workshop" | "hackathon" | 'other';
    major?: {
        _id: string;
        title: string;
    };
    requirements?: {
        _id: string;
        title: string;
        type?: RequirementType;
        value?: string | number;
        details?: string;
    }[];
    languageRequirements?: {
        _id: string;
        name: string;
        level: string;
        details?: string;
    }[];
    testRequirements?: {
        _id: string;
        name: string;
        score: number;
        details?: string;
    }[];
    gradeRequirements?: {
        _id: string;
        type: string;
        value: string | number;
        details?: string;
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
    year?: number; // Academic year or start year
    category: 'internship' | 'course' | 'travel' | 'volunteering' | "research" | "workshop" | "hackathon" | 'other';
    major?: {
        id: string;
        title: string;
    };
    requirements?: {
        id: string;
        title: string;
        type?: RequirementType;
        value?: string | number;
        details?: string;
    }[];
    languageRequirements?: {
        id: string;
        name: string;
        level: string;
        details?: string;
    }[];
    testRequirements?: {
        id: string;
        name: string;
        score: number;
        details?: string;
    }[];
    gradeRequirements?: {
        id: string;
        type: string;
        value: string | number;
        details?: string;
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

function formatActivityDocument(doc: ActivityDocument): Activity {
    return {
        id: doc._id?.toString() || '',
        userId: doc.userId.toString(),
        title: doc.title,
        description: doc.description,
        location: doc.location,
        duration: doc.duration,
        year: doc.year,
        category: doc.category,
        major: doc.major ? {
            id: doc.major._id,
            title: doc.major.title
        } : undefined,
        requirements: doc.requirements?.map(req => ({
            id: req._id,
            title: req.title,
            type: req.type,
            value: req.value,
            details: req.details
        })),
        languageRequirements: doc.languageRequirements?.map(req => ({
            id: req._id,
            name: req.name,
            level: req.level,
            details: req.details
        })),
        testRequirements: doc.testRequirements?.map(req => ({
            id: req._id,
            name: req.name,
            score: req.score,
            details: req.details
        })),
        gradeRequirements: doc.gradeRequirements?.map(req => ({
            id: req._id,
            type: req.type,
            value: req.value,
            details: req.details
        })),
        cost: doc.cost,
        recommended: doc.recommended,
        goodForWho: doc.goodForWho,
        link: doc.link,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
    };
}

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

        const formattedActivities: Activity[] = activities.map(({
            _id,
            userId,
            major,
            requirements,
            languageRequirements,
            testRequirements,
            gradeRequirements,
            ...rest
        }) => {
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
                    title: req.title,
                    type: req.type,
                    value: req.value,
                    details: req.details
                })) : undefined,
                languageRequirements: languageRequirements ? languageRequirements.map(req => ({
                    id: req._id,
                    name: req.name,
                    level: req.level,
                    details: req.details
                })) : undefined,
                testRequirements: testRequirements ? testRequirements.map(req => ({
                    id: req._id,
                    name: req.name,
                    score: req.score,
                    details: req.details
                })) : undefined,
                gradeRequirements: gradeRequirements ? gradeRequirements.map(req => ({
                    id: req._id,
                    type: req.type,
                    value: req.value,
                    details: req.details
                })) : undefined
            };
        });

        return formattedActivities;
    },

    findById: async (id: string): Promise<Activity | null> => {
        const collection = await getCollection<ActivityDocument>(DB_NAME, COLLECTION);
        const query: any = { _id: new ObjectId(id) };
        const activity = await collection.findOne(query)
        if (!activity) return null;

        return formatActivityDocument(activity);
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
                title: req.title,
                type: req.type,
                value: req.value,
                details: req.details
            })) : undefined;

        const languageRequirements = activityData.languageRequirements ?
            activityData.languageRequirements.map(req => ({
                _id: req._id,
                name: req.name,
                level: req.level,
                details: req.details
            })) : undefined;

        const testRequirements = activityData.testRequirements ?
            activityData.testRequirements.map(req => ({
                _id: req._id,
                name: req.name,
                score: req.score,
                details: req.details
            })) : undefined;

        const gradeRequirements = activityData.gradeRequirements ?
            activityData.gradeRequirements.map(req => ({
                _id: req._id,
                type: req.type,
                value: req.value,
                details: req.details
            })) : undefined;

        const now = new Date();
        const newActivity = {
            ...activityData,
            major,
            requirements,
            languageRequirements,
            testRequirements,
            gradeRequirements,
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
            updateData.requirements = updateData.requirements.map((req: {
                _id: any;
                title: any;
                type?: RequirementType;
                value?: string | number;
                details?: string;
            }) => ({
                _id: req._id,
                title: req.title,
                type: req.type,
                value: req.value,
                details: req.details
            }));
        }

        // Format language requirements if provided
        if (updateData.languageRequirements) {
            updateData.languageRequirements = updateData.languageRequirements.map((req: {
                _id: any;
                name: string;
                level: string;
                details?: string;
            }) => ({
                _id: req._id,
                name: req.name,
                level: req.level,
                details: req.details
            }));
        }

        // Format test requirements if provided
        if (updateData.testRequirements) {
            updateData.testRequirements = updateData.testRequirements.map((req: {
                _id: any;
                name: string;
                score: number;
                details?: string;
            }) => ({
                _id: req._id,
                name: req.name,
                score: req.score,
                details: req.details
            }));
        }

        // Format grade requirements if provided
        if (updateData.gradeRequirements) {
            updateData.gradeRequirements = updateData.gradeRequirements.map((req: {
                _id: any;
                type: string;
                value: string | number;
                details?: string;
            }) => ({
                _id: req._id,
                type: req.type,
                value: req.value,
                details: req.details
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
        year?: number;
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

        if (filters.year) {
            query.year = filters.year;
        }

        if (filters.search) {
            query.$or = [
                { title: { $regex: filters.search, $options: 'i' } },
                { description: { $regex: filters.search, $options: 'i' } }
            ];
        }

        const activities = await collection.find(query).sort({ createdAt: -1 }).toArray();

        return activities.map(({
            _id,
            userId,
            major,
            requirements,
            languageRequirements,
            testRequirements,
            gradeRequirements,
            ...rest
        }) => ({
            ...rest,
            id: _id.toString(),
            userId: userId.toString(),
            major: major ? {
                id: major._id,
                title: major.title
            } : undefined,
            requirements: requirements ? requirements.map(req => ({
                id: req._id,
                title: req.title,
                type: req.type,
                value: req.value,
                details: req.details
            })) : undefined,
            languageRequirements: languageRequirements ? languageRequirements.map(req => ({
                id: req._id,
                name: req.name,
                level: req.level,
                details: req.details
            })) : undefined,
            testRequirements: testRequirements ? testRequirements.map(req => ({
                id: req._id,
                name: req.name,
                score: req.score,
                details: req.details
            })) : undefined,
            gradeRequirements: gradeRequirements ? gradeRequirements.map(req => ({
                id: req._id,
                type: req.type,
                value: req.value,
                details: req.details
            })) : undefined
        }));
    }
};
