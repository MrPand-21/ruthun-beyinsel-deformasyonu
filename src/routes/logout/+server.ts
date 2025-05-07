import { redirect } from '@sveltejs/kit';
import { auth } from '../../lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
    const session = await event.locals.auth.validate();

    if (!session) {
        return redirect(302, '/');
    }

    // Invalidate the session
    await auth.invalidateSession(session.sessionId);

    // Remove the session cookie
    event.locals.auth.setSession(null);

    return redirect(302, '/');
};