import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../(auth)/login/$types';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();

    // If no active session, redirect to homepage
    if (!session) {
        throw redirect(303, '/');
    }

    return {
        session
    };
};