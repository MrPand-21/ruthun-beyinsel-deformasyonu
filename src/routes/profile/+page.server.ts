import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ActivityService } from '$lib/server/db/models/activity.model';
import { UserService } from '$lib/server/db/models/user.model';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.session;

    // Redirect to login if not authenticated
    if (!session) {
        redirect(303, '/login?callbackUrl=/profile');
    }

    try {
        // Get user's activities
        const userActivities = await ActivityService.findByUserId(session.userId.toString());

        // Format activities for the frontend
        const formattedActivities = userActivities.map(activity => ({
            id: activity._id!.toString(),
            title: activity.title,
            description: activity.description,
            location: activity.location,
            duration: activity.duration,
            category: activity.category,
            major: activity.major ? {
                id: activity.major._id,
                title: activity.major.title
            } : undefined,
            requirements: activity.requirements ? activity.requirements.map(req => ({
                id: req._id,
                title: req.title
            })) : undefined,
            cost: activity.cost,
            recommended: activity.recommended,
            goodForWho: activity.goodForWho,
            link: activity.link,
            createdAt: activity.createdAt.toISOString(),
            updatedAt: activity.updatedAt.toISOString()
        }));

        const user = await UserService.findById(session.userId);
        if (!user) {
            throw new Error('User not found');
        }

        const userData = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            emailVerified: user.emailVerified,
        };

        return {
            user: userData,
            activities: formattedActivities
        };
    } catch (err) {
        console.error('Error loading profile data:', err);
        throw new Error('Failed to load profile data');
    }
};