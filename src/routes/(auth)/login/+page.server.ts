import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { AuthError } from '@auth/core/errors';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (session) {
		redirect(303, '/');
	}

	return {
		form: await superValidate(zod(formSchema)),
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

			const result = await event.locals.signIn('credentials', {
				email,
				password,
				redirect: false,
				callbackUrl: url
			});

			if (result?.url) {
				redirect(303, result.url);
			} else if (result?.error) {
				return fail(400, {
					form,
					error: 'Invalid email or password'
				});
			} else {
				redirect(303, url);
			}
		} catch (error) {
			console.error('Login error:', error);
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

		return { form };
	}
};
