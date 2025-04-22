// src/routes/(auth)/register/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { UserService } from '$lib/server/models/user.model';

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
            const existingUser = await UserService.findByEmail(email);

            if (existingUser) {
                return fail(400, {
                    form,
                    error: 'Email already registered'
                });
            }

            // Create new user
            const user = await UserService.create({
                name,
                email,
                password,
                provider: 'credentials'
            });

            console.log('User registered successfully:', user._id);

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