import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ActivityService } from '$lib/server/db/models/activity.model';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const activity = await ActivityService.findById(params.id);
        if (!activity) {
            throw error(404, {
                message: 'Activity not found'
            });
        }

        return {
            activity
        };
    } catch (err) {
        console.error('Error loading activity:', err);
        throw error(500, {
            message: 'Failed to load activity'
        });
    }
};