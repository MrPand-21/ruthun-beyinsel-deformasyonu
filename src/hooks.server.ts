import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from "@sveltejs/kit";
import { SvelteKitAuthHandle } from '$lib/auth';

const authorization: Handle = async ({ event, resolve }) => {
    const protectedRoutes = ['/activities', '/send'];
    const isProtectedRoute = protectedRoutes.some(route =>
        event.url.pathname.startsWith(route)
    );

    console.log('Authorization middleware:', {
        isProtectedRoute,
        pathname: event.url.pathname,
        method: event.request.method,
        headers: event.request.headers.get('authorization'),
        session: await event.locals.auth()
    });

    if (isProtectedRoute) {
        const session = await event.locals.auth();
        if (!session) {
            redirect(307, `/login?callbackUrl=${event.url.pathname}`);
        }
    }

    return resolve(event);
};

export const handle = sequence(
    SvelteKitAuthHandle,
    authorization
);