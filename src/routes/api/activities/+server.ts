// src/routes/api/activities/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Activity } from '$lib/server/models/activity.model';
import mongoose from 'mongoose';

export const POST: RequestHandler = async (event) => {
    const session = await event.locals.getSession();

    if (!session || !session.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const requestData = await event.request.json();

        const {
            title,
            description,
            location,
            startDate,
            endDate,
            category,
            tags
        } = requestData;

        // Validate required fields
        if (!title || !description || !startDate || !endDate || !category) {
            return json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }


        // Create new activity
        const activity = new Activity({
            title,
            description,
            location,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            category,
            tags: Array.isArray(tags) ? tags : [],
            userId: new mongoose.Types.ObjectId(session.user.id)
        });

        await activity.save();

        // Convert the MongoDB document to a plain object
        const activityObject = activity.toObject();

        return json({
            message: 'Activity created successfully',
            activity: {
                ...activityObject,
                _id: activityObject._id.toString(),
                userId: activityObject.userId.toString(),
                startDate: activityObject.startDate.toISOString().split('T')[0],
                endDate: activityObject.endDate.toISOString().split('T')[0],
                createdAt: activityObject.createdAt.toISOString(),
                updatedAt: activityObject.updatedAt.toISOString()
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating activity:', error);
        return json(
            { error: 'Failed to create activity' },
            { status: 500 }
        );
    }
};