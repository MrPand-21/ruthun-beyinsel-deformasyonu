// src/routes/(auth)/register/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { UserService } from '$lib/server/db/models/user.model';
import { hashPassword, verifyPasswordStrength } from '$lib/server/utils';
import { RefillingTokenBucket } from '$lib/server/utils/rate-limit';
import { EmailVerificationService } from '$lib/server/db/models/email.verification.model';
import { SessionService, type SessionFlags } from '$lib/server/db/models/session.model';

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export const load = async (event) => {

    // If the user is already logged in, redirect to the homepage
    if (event.locals.session || event.locals.user) {
        if (!event.locals.user.emailVerified) {
            // return redirect(302, "/verify-email");
        }
        // if (!event.locals.user.registered2FA) {
        //     return redirect(302, "/2fa/setup");
        // }
        if (!event.locals.session.twoFactorVerified) {
            return redirect(302, "/2fa");
        }
        return redirect(302, "/");
    }

    return {
        form: await superValidate(zod(formSchema))
    };
};

export const actions: Actions = {
    default: async (event) => {

        // TODO: Assumes X-Forwarded-For is always included.
        const clientIP = event.request.headers.get("X-Forwarded-For");
        if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
            return fail(429, {
                message: "Too many requests",
                email: "",
                username: ""
            });
        }

        const form = await superValidate(event, zod(formSchema));

        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        const { username, email, password } = form.data;

        console.log('Received registration data:', { username, email, password });

        const strongPassword = await verifyPasswordStrength(password);
        if (!strongPassword) return fail(400, { message: "Weak password", email });
        if (clientIP !== null && !ipBucket.consume(clientIP, 1)) return fail(429, { message: "Too many requests", email, name });

        const user = await UserService.create({
            username: username,
            email: email.toLowerCase(),
            passwordHash: await hashPassword(password),
            emailVerified: false,
            totpKey: null
        });

        console.log('User registered successfully:', user._id);


        const emailVerificationRequest = await EmailVerificationService.createEmailVerificationRequest(user._id, email.toLowerCase());
        EmailVerificationService.sendVerificationEmail(emailVerificationRequest.email, emailVerificationRequest.code);
        EmailVerificationService.setEmailVerificationRequestCookie(event, emailVerificationRequest);

        const sessionFlags: SessionFlags = {
            twoFactorVerified: false
        };
        const sessionToken = SessionService.generateSessionToken();
        const session = await SessionService.create(sessionToken, user._id, sessionFlags);
        SessionService.setCookie(event, sessionToken, session.expirationDate);
        // throw redirect(302, "/verify-email");
    }
};