import { lucia } from '$lib/server/auth';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
    default: async (event) => {
        const session = await event.locals.session;

        if (!session) {
            return fail(401);
        }

        await lucia.invalidateSession(session.id);
        const sessionCookie = lucia.createBlankSessionCookie();
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });

        redirect(302, "/login");
    }
};