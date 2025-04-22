// src/routes/(auth)/register/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import mongoose from 'mongoose';

import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { User } from '$lib/server/models/user.model';
import { MONGODB_URI } from '$env/static/private';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();

    // If the user is already logged in, redirect to the homepage
    if (session) {
        redirect(303, '/');
    }

    return {
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

        const { name, email, password } = form.data;

        try {
            const existingUser = await User.findOne({ email: email.toLowerCase() });

            if (existingUser) {
                return fail(400, {
                    form,
                    error: 'Email already registered'
                });
            }

            // Create new user
            const user = new User({
                name,
                email: email.toLowerCase(),
                password,
                provider: 'credentials'
            });

            let savedUser = await user.save();

            console.log(savedUser);

            redirect(303, '/login?registered=true');

        } catch (error) {
            console.error('Registration error:', error);

            return fail(500, {
                form,
                error: 'An error occurred during registration'
            });
        }
    }
};