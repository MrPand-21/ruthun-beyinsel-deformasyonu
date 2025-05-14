import { sequence } from "@sveltejs/kit/hooks";

import type { Handle } from "@sveltejs/kit";
import { RefillingTokenBucket } from "$lib/server/utils/rate-limit";
import { SessionService } from "$lib/server/db/models/session.model";
import { initializeDatabase } from "$lib/server/db/mongodb";

const bucket = new RefillingTokenBucket<string>(100, 1);

const rateLimitHandle: Handle = async ({ event, resolve }) => {
    // Note: Assumes X-Forwarded-For will always be defined.
    const clientIP = event.request.headers.get("X-Forwarded-For");
    if (clientIP === null) {
        return resolve(event);
    }
    let cost: number;
    if (event.request.method === "GET" || event.request.method === "OPTIONS") {
        cost = 1;
    } else {
        cost = 3;
    }
    if (!bucket.consume(clientIP, cost)) {
        return new Response("Too many requests", {
            status: 429
        });
    }
    return resolve(event);
};

const authHandle: Handle = async ({ event, resolve }) => {
    const prevSession = !!event.locals.session;
    const token = event.cookies.get("session") ?? null;

    if (token === null) {
        event.locals.user = null;
        event.locals.session = null;

        // Apply headers to force revalidation when session is missing
        const response = await resolve(event);

        // Check if this is a state change (logged out)
        if (prevSession) {
            return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: new Headers({
                    ...Object.fromEntries(response.headers),
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'X-Auth-Changed': 'true'
                })
            });
        }

        return response;
    }

    const { session, user } = await SessionService.validateToken(token);
    const hadPrevSession = prevSession;
    const hasNewSession = !!session;
    const sessionChanged = (!hadPrevSession && hasNewSession) || (hadPrevSession && !hasNewSession);

    if (session !== null) {
        SessionService.setCookie(event, token, session.expirationDate);
    } else {
        SessionService.deleteCookie(event);
    }

    event.locals.session = session;
    event.locals.user = user;

    // Apply headers to force revalidation when session state changes
    const response = await resolve(event);

    if (sessionChanged) {
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: new Headers({
                ...Object.fromEntries(response.headers),
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'X-Auth-Changed': 'true'
            })
        });
    }

    return response;
};

const dbInitHandle: Handle = async ({ event, resolve }) => {
    try {
        await initializeDatabase();
        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Failed to initialize the database:", error);
    }
    return resolve(event);
};

export const handle = sequence(dbInitHandle, rateLimitHandle, authHandle);