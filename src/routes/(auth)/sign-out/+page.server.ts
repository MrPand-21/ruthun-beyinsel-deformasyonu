import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoadEvent, RequestEvent } from "./$types";
import { SessionService } from "$lib/server/db/models/session.model";

export function load(event: PageServerLoadEvent) {
    if (event.locals.session === null || event.locals.user === null) {
        return redirect(302, "/login");
    }
    if (!event.locals.user.emailVerified) {
        // return redirect(302, "/verify-email");
    }
    // if (!event.locals.user.registered2FA) {
    // 	return redirect(302, "/2fa/setup");
    // }
    // if (!event.locals.session.twoFactorVerified) {
    // 	return redirect(302, "/2fa");
    // }
    return {
        user: event.locals.user
    };
}

export const actions: Actions = {
    default: action
};

async function action(event: RequestEvent) {
    console.log("Sign out action called");
    if (event.locals.session === null) {
        return fail(401, {
            message: "Not authenticated"
        });
    }

    // Invalidate the session
    await SessionService.invalidate(event.locals.session.id);
    SessionService.deleteCookie(event);

    event.locals.user = null;
    event.locals.session = null;

    // The client-side form will handle the invalidateAll() call
    // We need to return a redirect to ensure the page reloads with fresh data
    return redirect(302, "/login");
}
