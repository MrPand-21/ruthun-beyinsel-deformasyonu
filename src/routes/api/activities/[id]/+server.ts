// src/routes/api/activities/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ActivityService } from '$lib/server/models/activity.model';
import { ObjectId } from 'mongodb';

export const PUT: RequestHandler = async (event) => {
    const session = await event.locals.auth();

    if (!session || !session.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activityId = event.params.id;

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(activityId)) {
        return json({ error: 'Invalid activity ID' }, { status: 400 });
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

        // Find the activity first to check if it exists
        const existingActivity = await ActivityService.findById(activityId, session.user.id);

        if (!existingActivity) {
            return json(
                { error: 'Activity not found or access denied' },
                { status: 404 }
            );
        }

        // Update activity using ActivityService
        const updateResult = await ActivityService.update(
            activityId,
            session.user.id!,
            {
                title,
                description,
                location,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                category,
                tags: Array.isArray(tags) ? tags : []
            }
        );

        if (!updateResult) {
            return json(
                { error: 'Failed to update activity' },
                { status: 500 }
            );
        }

        // Get the updated activity
        const updatedActivity = await ActivityService.findById(activityId, session.user.id);

        return json({
            message: 'Activity updated successfully',
            activity: {
                ...updatedActivity,
                _id: updatedActivity!._id!.toString(),
                id: updatedActivity!._id!.toString(),
                userId: typeof updatedActivity!.userId === 'object'
                    ? updatedActivity!.userId.toString()
                    : updatedActivity!.userId,
                startDate: updatedActivity!.startDate.toISOString().split('T')[0],
                endDate: updatedActivity!.endDate.toISOString().split('T')[0],
                createdAt: updatedActivity!.createdAt.toISOString(),
                updatedAt: updatedActivity!.updatedAt.toISOString()
            }
        });

    } catch (error) {
        console.error('Error updating activity:', error);
        return json(
            { error: 'Failed to update activity' },
            { status: 500 }
        );
    }
};

// Delete an activity
export const DELETE: RequestHandler = async (event) => {
    const session = await event.locals.auth();

    if (!session || !session.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activityId = event.params.id;

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(activityId)) {
        return json({ error: 'Invalid activity ID' }, { status: 400 });
    }

    try {
        // Delete the activity using ActivityService
        const deleteResult = await ActivityService.delete(activityId, session.user.id!);

        if (!deleteResult) {
            return json(
                { error: 'Activity not found or access denied' },
                { status: 404 }
            );
        }

        return json({
            message: 'Activity deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting activity:', error);
        return json(
            { error: 'Failed to delete activity' },
            { status: 500 }
        );
    }
};