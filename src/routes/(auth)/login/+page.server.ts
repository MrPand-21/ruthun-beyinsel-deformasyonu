import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { RefillingTokenBucket, Throttler } from '$lib/server/utils/rate-limit';
import type { ObjectId } from 'mongodb';
import { verifyPasswordHash } from '$lib/server/utils';
import { UserService } from '$lib/server/db/models/user.model';
import { SessionService, type SessionFlags } from '$lib/server/db/models/session.model';

export const load: PageServerLoad = async (event) => {
	if (event.locals.session !== null && event.locals.user !== null) {
		if (!event.locals.user.emailVerified) {
			// return redirect(302, "/verify-email");
		}
		// if (!event.locals.user.registered2FA) {
		// 	return redirect(302, "/2fa/setup");
		// }
		if (!event.locals.session.twoFactorVerified) {
			// return redirect(302, "/2fa");
		}
		return redirect(302, "/");
	}

	return {
		form: await superValidate(zod(formSchema)),
	};
};

const throttler = new Throttler<ObjectId>([0, 1, 2, 4, 8, 16, 30, 60, 180, 300]);
const ipBucket = new RefillingTokenBucket<string>(20, 1);


export const actions: Actions = {
	default: async (event) => {

		const clientIP = event.request.headers.get("X-Forwarded-For");
		if (clientIP !== null && !ipBucket.check(clientIP, 1)) return fail(429, { message: "Too many requests", email: "" });

		const form = await superValidate(event, zod(formSchema));

		if (!form.valid) return fail(400, { form });

		const { email, password } = form.data;


		const user = await UserService.findByEmail(email.toLowerCase());
		if (!user) return fail(400, { form, message: "Invalid email or password" });
		if (clientIP !== null && !ipBucket.consume(clientIP, 1)) return fail(429, { message: "Too many requests", email: "" });
		if (!throttler.consume(user._id)) return fail(429, { message: "Too many requests", email: "" });

		const validPassword = verifyPasswordHash(await UserService.getUserPasswordHash(user._id) as string, password);

		if (!validPassword) return fail(400, { form, message: "Invalid email or password" });

		throttler.reset(user._id);
		const sessionFlags: SessionFlags = {
			twoFactorVerified: false
		};
		const sessionToken = SessionService.generateSessionToken();
		const session = await SessionService.create(sessionToken, user._id, sessionFlags);
		SessionService.setCookie(event, sessionToken, session.expirationDate);

		if (!user.emailVerified) {
			// return redirect(302, "/verify-email");
		}
		// if (!user.registered2FA) {
		// 	return redirect(302, "/2fa/setup");
		// }
		return redirect(302, "/");
	}
};
