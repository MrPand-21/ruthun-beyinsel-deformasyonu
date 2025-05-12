import type { PageServerLoad } from './$types';
import { ActivityService } from '$lib/server/db/models/activity.model';
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

    return {
        activities,
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

        const { title,
            description,
            location,
            startDate,
            endDate,
            category,
            tags
        } = form.data;

        console.log('Received registration data:', { title, description, location, startDate, endDate, category, tags });


        const activity = await ActivityService.create({
            title,
            description,
            location,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            category,
            tags: tags || [],
            userId: ''
        });

        console.log('Activity registered successfully:', activity._id);



    }
};