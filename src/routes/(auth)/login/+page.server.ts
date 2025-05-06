import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { AuthError } from '@auth/core/errors';
import { signIn } from '@auth/sveltekit/client';

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

		return { form };
	}
};
