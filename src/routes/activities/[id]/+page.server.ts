import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ObjectId } from 'mongodb';
import { ActivityService } from '$lib/server/db/models/activity.model';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.session;

    if (!session) {
        redirect(303, '/login?callbackUrl=' + event.url.pathname);
    }

    const activityId = event.params.id;

    // Check if ID is a valid ObjectId
    if (!ObjectId.isValid(activityId)) {
        throw error(400, 'Invalid activity ID');
    }

    try {
        // Use ActivityService to get the activity
        const activity = await ActivityService.findById(activityId, session.user.id);

        if (!activity) {
            throw error(404, 'Activity not found');
        }

        // Format the activity for the frontend
        const formattedActivity = {
            ...activity,
            id: activity._id!.toString(),
            userId: typeof activity.userId === 'object' ? activity.userId.toString() : activity.userId,
            startDate: activity.startDate.toISOString().split('T')[0],
            endDate: activity.endDate.toISOString().split('T')[0],
            createdAt: activity.createdAt.toISOString(),
            updatedAt: activity.updatedAt.toISOString()
        };

        return {
            activity: formattedActivity
        };
    } catch (err) {
        console.error('Error fetching activity:', err);
        throw error(500, 'Failed to load activity');
    }
};