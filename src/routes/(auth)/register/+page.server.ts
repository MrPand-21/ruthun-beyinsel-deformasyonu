// src/routes/(auth)/register/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { lucia } from '../../../lib/server/auth';
import { generateId } from 'lucia';
import { hash } from "@node-rs/argon2";

import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { UserService } from '$lib/server/db/models/user.model';
import { hashPassword } from '$lib/server/utils';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.session;

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

        const existingUser = await UserService.findByEmail(email.toLowerCase());
        if (existingUser) {
            return fail(400, {
                form,
                message: 'Email already registered'
            });
        }

        const user = await UserService.create({
            username: name,
            email: email.toLowerCase(),
            password: await hashPassword(password),
        });

        console.log('User registered successfully:', user._id);

        const session = await lucia.createSession(user._id.toString(), {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });

        redirect(302, "/");
    }
};