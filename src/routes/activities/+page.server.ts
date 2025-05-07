// src/routes/activities/+page.server.ts
import type { PageServerLoad } from './$types';
import { ActivityService } from '$lib/server/db/models/activity.model';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();

    if (!session || !session.user) {
        redirect(303, '/login?callbackUrl=/activities');
    }

    try {
        const activities = await ActivityService.findByUserId(session.user.id!);

        // Format activities for the frontend
        const formattedActivities = activities.map(activity => ({
            ...activity,
            id: activity._id!.toString(),
            startDate: activity.startDate.toISOString().split('T')[0],
            endDate: activity.endDate.toISOString().split('T')[0],
            createdAt: activity.createdAt.toISOString(),
            updatedAt: activity.updatedAt.toISOString()
        }));

        return {
            activities: formattedActivities
        };
    } catch (err) {
        console.error('Error fetching activities:', err);
        throw error(500, 'Failed to load activities');
    }
};