import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../activities/$types';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();

    // If the user is already logged in, redirect to the home page or the callback URL
    if (session) {
        const callbackUrl = event.url.searchParams.get('callbackUrl') || '/';
        throw redirect(303, callbackUrl);
    }

    return {
        session
    };
};