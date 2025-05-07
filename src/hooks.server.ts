import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from "@sveltejs/kit";
import { lucia } from './lib/server/auth';

const handleAuth: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get(lucia.sessionCookieName);
    if (!sessionId) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        // sveltekit types deviates from the de-facto standard
        // you can use 'as any' too
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });
    }
    if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });
    }
    event.locals.user = user;
    event.locals.session = session;
    return resolve(event);

};

const authorization: Handle = async ({ event, resolve }) => {
    const protectedRoutes = ['/activities', '/send'];
    const isProtectedRoute = protectedRoutes.some(route =>
        event.url.pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        const session = await event.locals.session;
        if (!session) {
            redirect(307, `/login?callbackUrl=${event.url.pathname}`);
        }
    }

    return resolve(event);
};

export const handle = sequence(
    handleAuth,
    authorization
);
