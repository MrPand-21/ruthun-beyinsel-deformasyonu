import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { lucia } from '../../../lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { UserService } from '$lib/server/db/models/user.model';
import { comparePassword } from '$lib/server/utils';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.session;

	if (session) {
		redirect(303, '/');
	}

	let source = event.url?.searchParams?.get("source") || event.url?.searchParams?.get("callbackUrl");
	if (!source || source == "") {
		source = "/";
	}

	return {
		form: await superValidate(zod(formSchema)),
		source: source,
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

		const user = await UserService.findByEmail(email.toLowerCase());
		if (!user) {
			return fail(400, {
				form,
				message: "Invalid email or password"
			});
		}
		const validPassword = comparePassword(user, password);

		if (!validPassword) {
			return fail(400, {
				form,
				message: "Invalid email or password"
			});
		}

		const session = await lucia.createSession(user._id!.toString(), {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		return redirect(302, "/");
	}
};
