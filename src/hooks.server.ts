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
    const token = event.cookies.get("session") ?? null;
    if (token === null) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }


    const { session, user } = await SessionService.validateToken(token)
    if (session !== null) {
        SessionService.setCookie(event, token, session.expirationDate);
    } else {
        SessionService.deleteCookie(event);
    }

    event.locals.session = session;
    event.locals.user = user;
    console.log("User:", user);
    return resolve(event);
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