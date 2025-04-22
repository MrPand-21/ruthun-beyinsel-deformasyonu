// src/routes/api/activities/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Activity } from '$lib/server/models/activity.model';
import mongoose from 'mongoose';

export const PUT: RequestHandler = async (event) => {
    const session = await event.locals.auth();

    if (!session || !session.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activityId = event.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
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


        // Find the activity and check ownership
        const activity = await Activity.findOne({
            _id: activityId,
            userId: session.user.id
        });

        if (!activity) {
            return json(
                { error: 'Activity not found or access denied' },
                { status: 404 }
            );
        }

        // Update activity fields
        activity.title = title;
        activity.description = description;
        activity.location = location;
        activity.startDate = new Date(startDate);
        activity.endDate = new Date(endDate);
        activity.category = category;
        activity.tags = Array.isArray(tags) ? tags : [];

        await activity.save();

        // Convert the MongoDB document to a plain object
        const activityObject = activity.toObject();

        return json({
            message: 'Activity updated successfully',
            activity: {
                ...activityObject,
                _id: activityObject._id.toString(),
                userId: activityObject.userId.toString(),
                startDate: activityObject.startDate.toISOString().split('T')[0],
                endDate: activityObject.endDate.toISOString().split('T')[0],
                createdAt: activityObject.createdAt.toISOString(),
                updatedAt: activityObject.updatedAt.toISOString()
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
    const session = await event.locals.getSession();

    if (!session || !session.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activityId = event.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
        return json({ error: 'Invalid activity ID' }, { status: 400 });
    }

    try {

        // Find the activity and check ownership
        const activity = await Activity.findOne({
            _id: activityId,
            userId: session.user.id
        });

        if (!activity) {
            return json(
                { error: 'Activity not found or access denied' },
                { status: 404 }
            );
        }

        // Delete the activity
        await Activity.deleteOne({ _id: activityId });

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