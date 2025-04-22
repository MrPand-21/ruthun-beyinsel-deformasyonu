// src/routes/api/activities/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ActivityService } from '$lib/server/models/activity.model';
import { ObjectId } from 'mongodb';

export const POST: RequestHandler = async (event) => {
    const session = await event.locals.auth();

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

        // Create new activity using ActivityService
        const activity = await ActivityService.create({
            title,
            description,
            location,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            category,
            tags: Array.isArray(tags) ? tags : [],
            userId: new ObjectId(session.user.id)
        });

        return json({
            message: 'Activity created successfully',
            activity: {
                ...activity,
                _id: activity._id.toString(),
                userId: typeof activity.userId === 'object' ? activity.userId.toString() : activity.userId,
                startDate: activity.startDate.toISOString().split('T')[0],
                endDate: activity.endDate.toISOString().split('T')[0],
                createdAt: activity.createdAt.toISOString(),
                updatedAt: activity.updatedAt.toISOString()
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