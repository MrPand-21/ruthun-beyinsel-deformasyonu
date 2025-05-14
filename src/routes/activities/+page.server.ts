import type { PageServerLoad } from './$types';
import { ActivityService } from '$lib/server/db/models/activity.model';
import { MajorService } from '$lib/server/db/models/major.model';
import { RequirementService } from '$lib/server/db/models/requirement.model';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

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
        console.log('Received form submission:', event.request.body);

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

        console.log('Received activity data:', {
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
        });

        const session = await event.locals.session;

        const activity = await ActivityService.create({
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
        });

        console.log('Activity registered successfully:', activity._id);
    }
};