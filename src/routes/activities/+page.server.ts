import type { PageServerLoad } from './$types';
import { ActivityService, type Activity } from '$lib/server/db/models/activity.model';
import { MajorService } from '$lib/server/db/models/major.model';
import { RequirementService } from '$lib/server/db/models/requirement.model';
import { RequirementTypeService } from '$lib/server/db/models/requirement.type.model';
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

    return {
        activities: await ActivityService.findAll(),
        majors: await MajorService.findAll(),
        requirements: await RequirementService.findAll(),
        languageRequirements: await RequirementTypeService.findLanguageRequirements(),
        testRequirements: await RequirementTypeService.findTestRequirements(),
        gradeRequirements: await RequirementTypeService.findGradeRequirements(),
        session: {
            id: session.id.toString(),
            userId: session.userId.toString()
        },
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
            year,
            category,
            major,
            requirements,
            languageRequirements,
            testRequirements,
            gradeRequirements,
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
                year,
                category,
                major,
                requirements,
                languageRequirements,
                testRequirements,
                gradeRequirements,
                cost,
                recommended,
                goodForWho,
                link,
                userId: session.userId,
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