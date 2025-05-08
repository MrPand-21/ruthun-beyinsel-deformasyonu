import { ObjectId } from 'mongodb';
import { getDatabaseName, getCollection } from '../mongodb';
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { generateRandomOTP } from '$lib/server/utils';
import { UserService, type User } from "./user.model";

import type { RequestEvent } from "@sveltejs/kit";
import { dev } from '$app/environment';

export interface PasswordResetSessionDocument {
    _id: string;
    userId: ObjectId;
    email: string;
    code: string;
    expirationDate: Date;
    emailVerified: boolean;
    twoFactorVerified: boolean;
}

export interface PasswordResetSession {
    id: string;
    userId: ObjectId;
    email: string;
    expirationDate: Date;
    code: string;
    emailVerified: boolean;
    twoFactorVerified: boolean;
}

export type PasswordResetSessionValidationResult =
    | { session: PasswordResetSession; user: User }
    | { session: null; user: null };

const COLLECTION = 'password_reset_sessions';
const DB_NAME = getDatabaseName();

const _hashToken = (token: string): string => {
    return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
};

export const PasswordResetSessionService = {
    createPasswordResetSession: async (token: string, userId: ObjectId, email: string): Promise<PasswordResetSession> => {
        const collection = await getCollection<PasswordResetSessionDocument>(DB_NAME, COLLECTION);
        const sessionId = _hashToken(token);
        const expirationDate = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes
        const code = generateRandomOTP();

        const sessionDocument: PasswordResetSessionDocument = {
            _id: sessionId,
            userId,
            email: email.toLowerCase(),
            code,
            expirationDate,
            emailVerified: false,
            twoFactorVerified: false
        };

        await collection.insertOne(sessionDocument);

        return {
            id: sessionId,
            userId,
            email: email.toLowerCase(),
            code,
            expirationDate,
            emailVerified: false,
            twoFactorVerified: false
        };
    },

    validatePasswordResetSessionToken: async (token: string): Promise<PasswordResetSessionValidationResult> => {
        const collection = await getCollection<PasswordResetSessionDocument>(DB_NAME, COLLECTION);
        const sessionId = _hashToken(token);

        const sessionDoc = await collection.findOne({ _id: sessionId });

        if (!sessionDoc) {
            return { session: null, user: null };
        }

        if (new Date() > sessionDoc.expirationDate) {
            await collection.deleteOne({ _id: sessionId });
            return { session: null, user: null };
        }

        const user = await UserService.findById(sessionDoc.userId);
        if (!user) {
            await collection.deleteOne({ _id: sessionId });
            return { session: null, user: null };
        }

        const session: PasswordResetSession = {
            id: sessionDoc._id,
            userId: sessionDoc.userId,
            email: sessionDoc.email,
            code: sessionDoc.code,
            expirationDate: sessionDoc.expirationDate,
            emailVerified: sessionDoc.emailVerified,
            twoFactorVerified: sessionDoc.twoFactorVerified
        };

        return { session, user };
    },

    setPasswordResetSessionAsEmailVerified: async (token: string): Promise<boolean> => {
        const collection = await getCollection<PasswordResetSessionDocument>(DB_NAME, COLLECTION);
        const sessionId = _hashToken(token);
        const result = await collection.updateOne({ _id: sessionId }, { $set: { emailVerified: true } });
        return result.modifiedCount > 0;
    },

    setPasswordResetSessionAs2FAVerified: async (token: string): Promise<boolean> => {
        const collection = await getCollection<PasswordResetSessionDocument>(DB_NAME, COLLECTION);
        const sessionId = _hashToken(token);
        const result = await collection.updateOne({ _id: sessionId }, { $set: { twoFactorVerified: true } });
        return result.modifiedCount > 0;
    },

    invalidateUserPasswordResetSessions: async (userId: ObjectId): Promise<void> => {
        const collection = await getCollection<PasswordResetSessionDocument>(DB_NAME, COLLECTION);
        await collection.deleteMany({ userId });
    },

    invalidatePasswordResetSession: async (token: string): Promise<void> => {
        const collection = await getCollection<PasswordResetSessionDocument>(DB_NAME, COLLECTION);
        const sessionId = _hashToken(token);
        await collection.deleteOne({ _id: sessionId });
    },

    validatePasswordResetSessionRequest: async (event: RequestEvent): Promise<PasswordResetSessionValidationResult> => {
        const token = event.cookies.get("password_reset_session") ?? null;
        if (token === null) {
            return { session: null, user: null };
        }
        const result = await PasswordResetSessionService.validatePasswordResetSessionToken(token);
        if (result.session === null) {
            PasswordResetSessionService.deletePasswordResetSessionTokenCookie(event);
        }
        return result;
    },

    setPasswordResetSessionTokenCookie: (event: RequestEvent, token: string, expiresAt: Date): void => {
        event.cookies.set("password_reset_session", token, {
            expires: expiresAt,
            sameSite: "lax",
            httpOnly: true,
            path: "/",
            secure: !dev
        });
    },

    deletePasswordResetSessionTokenCookie: (event: RequestEvent): void => {
        event.cookies.set("password_reset_session", "", {
            maxAge: 0,
            sameSite: "lax",
            httpOnly: true,
            path: "/",
            secure: !dev
        });
    },

    sendPasswordResetEmail: (email: string, code: string): void => {
        // TODO: email sending logic here
        console.log(`To ${email}: Your password reset code is ${code}`);
        // Example: await sendEmail({ to: email, subject: "Reset Your Password", text: `Your code: ${code}` });
    }
};