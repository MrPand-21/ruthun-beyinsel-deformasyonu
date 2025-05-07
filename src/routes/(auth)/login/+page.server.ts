import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { auth, googleAuth } from '../../../lib/server/auth';
import { generateState, generateCodeVerifier } from 'arctic';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import bcrypt from 'bcryptjs';
import { LuciaError } from 'lucia';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth.validate();

	if (session) {
		redirect(303, '/');
	}

	// Get the return URL from query parameters
	let source = event.url?.searchParams?.get("source") || event.url?.searchParams?.get("callbackUrl");
	if (!source || source == "") {
		source = "/";
	}

	// Generate Google OAuth state
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	// Store state and PKCE code verifier in cookies for verification in callback
	event.cookies.set('google_oauth_state', state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: 60 * 10 // 10 minutes
	});

	event.cookies.set('google_oauth_code_verifier', codeVerifier, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: 60 * 10 // 10 minutes
	});

	// Generate the Google OAuth URL
	const googleAuthURL = await googleAuth.createAuthorizationURL(state, codeVerifier, {
		scopes: ['email', 'profile']
	});

	return {
		form: await superValidate(zod(formSchema)),
		source: source,
		googleAuthURL: googleAuthURL.toString()
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

		try {
			// Get email and password from form
			const { email, password } = form.data;

			// Find user with matching email and validate password
			try {
				const key = await auth.useKey('email', email.toLowerCase());
				const validPassword = await bcrypt.compare(password, key.passwordHash || '');

				if (!validPassword) {
					return fail(400, {
						form,
						message: "Invalid email or password"
					});
				}

				// Create new session
				const session = await auth.createSession({
					userId: key.userId,
					attributes: {}
				});

				// Set session cookie
				event.locals.auth.setSession(session);

				// Redirect to source URL or home page
				const redirectTo = form.data.source || "/";
				redirect(303, redirectTo);

			} catch (e) {
				// Handle different types of errors
				if (e instanceof LuciaError && (e.message === "AUTH_INVALID_KEY_ID" || e.message === "AUTH_INVALID_PASSWORD")) {
					return fail(400, {
						form,
						message: "Invalid email or password"
					});
				}

				throw e; // Rethrow unknown errors
			}
		} catch (error) {
			console.error('Login error:', error);
			return fail(500, {
				form,
				message: "An error occurred during login"
			});
		}
	}
};
