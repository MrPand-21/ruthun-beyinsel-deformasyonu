import type { PageServerLoad } from './$types';
import { ActivityService } from '$lib/server/db/models/activity.model';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.session;

    if (!session) {
        redirect(303, '/login?callbackUrl=/activities');
    }

    const activities = await ActivityService.findAll();

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

};