import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { AuthError } from '@auth/core/errors';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	// If the user is already logged in, redirect to the homepage
	if (session) {
		redirect(303, '/');
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
				form,
			});
		}

		const { email, password } = form.data;

		try {
			const url = event.url.searchParams.get('callbackUrl') || '/';

			// This is the correct way to sign in with Auth.js in SvelteKit
			const result = await event.locals.signIn('credentials', {
				email,
				password,
				redirect: false, // Don't auto-redirect to allow proper error handling
				callbackUrl: url
			});

			// If sign-in successful, redirect manually
			if (result?.url) {
				redirect(303, result.url);
			} else if (result?.error) {
				return fail(400, {
					form,
					error: 'Invalid email or password'
				});
			} else {
				// If no error but no redirect URL, redirect to homepage or callback
				redirect(303, url);
			}
		} catch (error) {
			console.error('Login error:', error);
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

		// This should only be reached if none of the above redirects or returns happen
		return { form };
	}
};
