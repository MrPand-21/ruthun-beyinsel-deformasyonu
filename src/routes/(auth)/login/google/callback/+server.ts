import { redirect, error, type RequestHandler } from '@sveltejs/kit';
import { auth, googleAuth } from '../../../../../lib/server/auth';
import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { getDatabaseName, getCollection } from '$lib/server/db/mongodb';

export const GET: RequestHandler = async (event) => {
    const code = event.url.searchParams.get('code');
    const state = event.url.searchParams.get('state');

    const storedState = event.cookies.get('google_oauth_state');
    const storedCodeVerifier = event.cookies.get('google_oauth_code_verifier');

    event.cookies.delete('google_oauth_state', { path: '/' });
    event.cookies.delete('google_oauth_code_verifier', { path: '/' });

    if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
        return error(400, 'Invalid authentication request');
    }

    try {
        const tokens = await googleAuth.validateAuthorizationCode(code, storedCodeVerifier);

        const googleUserResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });

        const googleUser = await googleUserResponse.json();

        if (!googleUser.email || !googleUser.sub) {
            return error(400, 'Invalid Google user data');
        }

        try {
            const key = await auth.("google", googleUser.sub);
            const session = await auth.createSession({
                userId: key.userId,
                attributes: {}
            });

            event.locals.auth.setSession(session);
            return redirect(302, '/');
        } catch (e) {
            // User doesn't exist with this Google account
            // Continue with user creation
        }

        // User doesn't exist, create a new user with Google credentials
        const userId = generateId(15);

        // Use the MongoDB adapter directly
        const dbName = getDatabaseName();
        const usersCollection = await getCollection(dbName, 'users');

        // Create user in the users collection
        await usersCollection.insertOne({
            id: userId,
            name: googleUser.name,
            email: googleUser.email.toLowerCase(),
            email_verified: googleUser.email_verified || false,
            image: googleUser.picture,
            created_at: new Date()
        });

        // Create key for the Google OAuth connection using Lucia v3 API
        await auth.createKey({
            userId: userId,
            providerId: 'google',
            providerUserId: googleUser.sub,
            password: null
        });

        // Create key for email authentication
        await auth.createKey({
            userId: userId,
            providerId: 'email',
            providerUserId: googleUser.email.toLowerCase(),
            password: null
        });

        // Create session for the new user
        const session = await auth.createSession({
            userId: userId,
            attributes: {}
        });

        event.locals.auth.setSession(session);
        return redirect(302, '/');

    } catch (e) {
        console.error('Google OAuth error:', e);

        if (e instanceof OAuth2RequestError) {
            // Invalid code
            return error(400, 'Invalid OAuth request');
        }

        return error(500, 'An unknown error occurred');
    }
};