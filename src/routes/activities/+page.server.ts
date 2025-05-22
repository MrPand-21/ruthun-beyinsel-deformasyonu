import type { PageServerLoad } from './$types';
import { ActivityService } from '$lib/server/db/models/activity.model';
import { MajorService } from '$lib/server/db/models/major.model';
import { RequirementService } from '$lib/server/db/models/requirement.model';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { ObjectId } from 'mongodb';

export const load = async (event) => {
    const session = await event.locals.session;

    if (!session) {
        redirect(303, '/login?callbackUrl=/activities');
    }

    const activities = await ActivityService.findAll();
    const majors = await MajorService.findAll();
    const requirements = await RequirementService.findAll();

    return {
        activities,
        majors,
        requirements,
        form: await superValidate(zod(formSchema))
    };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(formSchema));

        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        const {
            title,
            description,
            location,
            duration,
            category,
            major,
            requirements,
            cost,
            recommended,
            goodForWho,
            link,
        } = form.data;

        const session = await event.locals.session;
        if (!session) {
            return fail(401, { form, error: 'Unauthorized' });
        }

        try {
            await ActivityService.create({
                title,
                description,
                location,
                duration,
                category,
                major,
                requirements,
                cost,
                recommended,
                goodForWho,
                link,
                userId: new ObjectId(session.user.id),
                userInfo: {
                    username: session.user.username,
                    email: session.user.email,
                    image: session.user.image
                }
            });

            return { form };
        } catch (error) {
            console.error('Error creating activity:', error);
            return fail(500, {
                form,
                error: 'Failed to create activity'
            });
        }
    }
};