import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { AuthError } from '@auth/core/errors';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();

	// If the user is already logged in, redirect to the homepage
	if (session) {
		throw redirect(303, '/');
	}

	// Get the callback URL from the query string
	const callbackUrl = event.url.searchParams.get('callbackUrl') || '/';

	return {
		form: await superValidate(zod(formSchema)),
		callbackUrl
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

		const { email, password } = form.data;

		try {
			const url = event.url.searchParams.get('callbackUrl') || '/';

			// Sign in with credentials
			await event.locals.signIn('credentials', {
				email,
				password,
				redirectTo: url
			});
		} catch (error) {
			// If login fails, return the form with an error message
			if (error instanceof AuthError) {
				return fail(400, {
					form,
					error: 'Invalid email or password'
				});
			}
			return fail(500, {
				form,
				error: 'An unexpected error occurred'
			});
		}

		// The Auth.js callback should handle the redirect
		return { form };
	}
};
