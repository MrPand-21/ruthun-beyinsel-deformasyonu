import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GOOGLE_CLIENT_ID } from '$env/static/private';

// Define the base URL from the request
function getBaseUrl(request: Request): string {
    const host = request.headers.get('host') || 'localhost:5173';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
}

export const GET: RequestHandler = async ({ cookies, request }) => {
    // Generate a random state string for security
    const state = Math.random().toString(36).substring(2, 15);

    // Store the state in a cookie to verify later
    cookies.set('google_auth_state', state, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 10 // 10 minutes
    });

    const baseUrl = getBaseUrl(request);

    // Construct the Google OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

    authUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', `${baseUrl}/api/auth/google/callback`);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'openid email profile');
    authUrl.searchParams.append('state', state);

    // Redirect to Google for authentication
    redirect(302, authUrl.toString());
};