import { ObjectId } from 'mongodb';
import { getDatabaseName, getCollection } from '../mongodb';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { UserService, type User } from "./user.model"; // Assuming User type is exported from user.model.ts

import type { RequestEvent } from "@sveltejs/kit";
import type { Nullable } from '$lib/types';
import { dev } from '$app/environment';

export interface SessionDocument {
    _id: string;
    userId: ObjectId;
    expirationDate: Date;
    twoFactorVerified: boolean;
}

export interface SessionFlags {
    twoFactorVerified: boolean;
}

export interface Session extends SessionFlags {
    id: string;
    expirationDate: Date;
    userId: ObjectId;
}

export type SessionValidationResult = { session: Nullable<Session>; user: Nullable<User> };

const COLLECTION = 'sessions';
const DB_NAME = getDatabaseName();

export const SessionService = {
    generateSessionToken: (): string => {
        const tokenBytes = new Uint8Array(20);
        crypto.getRandomValues(tokenBytes);
        const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
        return token;
    },

    _hashToken: (token: string): string => {
        return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    },

    create: async (token: string, userId: ObjectId, flags: SessionFlags): Promise<Session> => {
        const collection = await getCollection<SessionDocument>(DB_NAME, COLLECTION);
        const sessionId = SessionService._hashToken(token);
        const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

        const sessionDocument: SessionDocument = {
            _id: sessionId,
            userId,
            expirationDate,
            twoFactorVerified: flags.twoFactorVerified
        };

        await collection.insertOne(sessionDocument);

        return {
            id: sessionId,
            userId,
            expirationDate,
            twoFactorVerified: flags.twoFactorVerified
        };
    },

    validateToken: async (token: string): Promise<SessionValidationResult> => {
        const collection = await getCollection<SessionDocument>(DB_NAME, COLLECTION);
        const sessionId = SessionService._hashToken(token);

        const sessionDoc = await collection.findOne({ _id: sessionId });

        if (!sessionDoc) {
            return { session: null, user: null };
        }

        let session: Session = {
            id: sessionDoc._id,
            userId: sessionDoc.userId,
            expirationDate: sessionDoc.expirationDate,
            twoFactorVerified: sessionDoc.twoFactorVerified
        };

        if (Date.now() >= session.expirationDate.getTime()) {
            await collection.deleteOne({ _id: session.id });
            return { session: null, user: null };
        }

        // Refresh session if it's older than 15 days
        if (Date.now() >= session.expirationDate.getTime() - 1000 * 60 * 60 * 24 * 15) {
            session.expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // Extend by 30 days
            await collection.updateOne(
                { _id: session.id },
                { $set: { expirationDate: session.expirationDate } }
            );
        }

        const user = await UserService.findById(session.userId);

        // session exists for a non-existent user, invalidate
        if (!user) {
            await collection.deleteOne({ _id: session.id });
            return { session: null, user: null };
        }

        return { session, user };
    },

    invalidate: async (sessionId: string): Promise<void> => {
        const collection = await getCollection<SessionDocument>(DB_NAME, COLLECTION);
        const hashedSessionId = SessionService._hashToken(sessionId);
        await collection.deleteOne({ _id: hashedSessionId });
    },

    invalidateAllUserSessions: async (userId: ObjectId): Promise<void> => {
        const collection = await getCollection<SessionDocument>(DB_NAME, COLLECTION);
        await collection.deleteMany({ userId });
    },

    setAs2FAVerified: async (sessionId: string): Promise<void> => {
        const collection = await getCollection<SessionDocument>(DB_NAME, COLLECTION);
        const hashedSessionId = SessionService._hashToken(sessionId);
        await collection.updateOne({ _id: hashedSessionId }, { $set: { twoFactorVerified: true } });
    },

    setCookie: (event: RequestEvent, token: string, expiresAt: Date): void => {
        event.cookies.set("session", token, {
            httpOnly: true,
            path: "/",
            secure: !dev,
            sameSite: "lax",
            expires: expiresAt
        });
    },

    deleteCookie: (event: RequestEvent): void => {
        event.cookies.set("session", "", {
            httpOnly: true,
            path: "/",
            secure: !dev,
            sameSite: "lax",
            maxAge: 0
        });
    }
};

