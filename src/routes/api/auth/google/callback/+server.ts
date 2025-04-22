import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { UserService } from '$lib/server/models/user.model';

// Define the callback URL - use PUBLIC_BASE_URL or construct from request
function getBaseUrl(request: Request): string {
    const host = request.headers.get('host') || 'localhost:5173';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
}

export const GET: RequestHandler = async ({ url, cookies, fetch, request }) => {
    // Extract the authorization code and state from the URL
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    // Get the stored state from the cookie
    const storedState = cookies.get('google_auth_state');

    // Verify the state to prevent CSRF attacks
    if (!state || !storedState || state !== storedState) {
        throw error(400, 'Invalid state parameter');
    }

    // Clear the state cookie
    cookies.delete('google_auth_state', { path: '/' });

    if (!code) {
        throw error(400, 'Authorization code is missing');
    }

    try {
        const baseUrl = getBaseUrl(request);

        // Exchange the code for an access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: `${baseUrl}/api/auth/google/callback`,
                grant_type: 'authorization_code',
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Token exchange error:', tokenData);
            throw error(400, 'Failed to exchange authorization code for token');
        }

        // Get user info with the access token
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        const userData = await userInfoResponse.json();

        if (!userInfoResponse.ok) {
            console.error('User info error:', userData);
            throw error(400, 'Failed to get user information');
        }

        // Find or create user in the database
        let user = await UserService.findByProviderId(userData.id);

        if (!user) {
            // Check if a user with this email already exists
            user = await UserService.findByEmail(userData.email);

            if (user) {
                // Update existing user with Google info if they were using email/password
                await UserService.update(user._id!.toString(), {
                    provider: 'google',
                    providerId: userData.id,
                    image: userData.picture
                });
            } else {
                // Create a new user
                user = await UserService.create({
                    email: userData.email,
                    name: userData.name,
                    image: userData.picture,
                    provider: 'google',
                    providerId: userData.id
                });
            }
        }

        // Instead of directly setting the session, redirect to the login page with special params
        // that will trigger the auth provider to recognize the Google sign-in
        // This leverages the existing @auth/sveltekit configuration in hooks.server.ts
        redirect(302, `/api/auth/callback/google?${new URLSearchParams({
            access_token: tokenData.access_token,
            id_token: tokenData.id_token
        }).toString()}`);

    } catch (err) {
        console.error('Google authentication error:', err);
        throw error(500, 'Authentication failed');
    }
};