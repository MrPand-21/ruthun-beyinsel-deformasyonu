// src/routes/activities/[id]/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import mongoose from 'mongoose';
import { Activity, type ActivityDocument } from '$lib/server/models/activity.model';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();

    if (!session || !session.user) {
        throw redirect(303, '/login?callbackUrl=' + event.url.pathname);
    }

    const activityId = event.params.id;

    if (!mongoose.Types.ObjectId.isValid(activityId)) {
        throw error(400, 'Invalid activity ID');
    }

    try {


        //TODO: CHECK THAT
        const activity: any = await Activity.findOne({
            _id: activityId,
            userId: session.user.id
        }).lean();

        if (!activity) {
            throw error(404, 'Activity not found');
        }

        // Format the activity for the frontend
        const formattedActivity = {
            ...activity,
            id: activity._id.toString(),
            userId: activity.userId.toString(),
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