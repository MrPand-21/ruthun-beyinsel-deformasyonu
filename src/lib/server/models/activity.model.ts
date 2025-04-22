import mongoose from 'mongoose';
import type { Document } from 'mongoose';

export interface ActivityDocument extends Document {
    title: string;
    description: string;
    location?: string;
    startDate: Date;
    endDate: Date;
    category: 'internship' | 'course' | 'travel' | 'volunteering' | 'other';
    tags: string[];
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const activitySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        location: {
            type: String
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        category: {
            type: String,
            enum: ['internship', 'course', 'travel', 'volunteering', 'other'],
            required: true
        },
        tags: [{
            type: String,
            trim: true
        }],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Activity = mongoose.models.Activity || mongoose.model<ActivityDocument>('Activity', activitySchema);
