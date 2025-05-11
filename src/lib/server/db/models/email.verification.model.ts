import { ObjectId } from 'mongodb';
import { getDatabaseName, getCollection } from '../mongodb';
import { generateRandomOTP } from '$lib/server/utils'; // Assuming generateRandomOTP is in utils
import { encodeBase32 } from "@oslojs/encoding";
import { ExpiringTokenBucket } from '$lib/server/utils/rate-limit'; // Assuming ExpiringTokenBucket is in utils/rate-limit

import type { RequestEvent } from "@sveltejs/kit";
import type { Nullable } from '$lib/types';
import { dev } from '$app/environment';

export interface EmailVerificationRequestDocument {
    _id: string;
    userId: ObjectId;
    code: string;
    email: string;
    expirationDate: Date;
}

export interface EmailVerificationRequest {
    id: string;
    userId: ObjectId;
    code: string;
    email: string;
    expirationDate: Date;
}

const COLLECTION = 'email_verification_requests';
const DB_NAME = getDatabaseName();

export const EmailVerificationService = {
    getUserEmailVerificationRequest: async (userId: ObjectId, id: string): Promise<Nullable<EmailVerificationRequest>> => {
        const collection = await getCollection<EmailVerificationRequestDocument>(DB_NAME, COLLECTION);
        const requestDoc = await collection.findOne({ _id: id, userId: userId });

        if (!requestDoc) {
            return null;
        }
        return {
            id: requestDoc._id,
            userId: requestDoc.userId,
            code: requestDoc.code,
            email: requestDoc.email,
            expirationDate: requestDoc.expirationDate
        };
    },

    createEmailVerificationRequest: async (userId: ObjectId, email: string): Promise<EmailVerificationRequest> => {
        await EmailVerificationService.deleteUserEmailVerificationRequests(userId); // Delete existing requests for the user

        const collection = await getCollection<EmailVerificationRequestDocument>(DB_NAME, COLLECTION);
        const idBytes = new Uint8Array(20);
        crypto.getRandomValues(idBytes);
        const id = encodeBase32(idBytes).toLowerCase();
        const code = generateRandomOTP();
        const expirationDate = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

        const requestDocument: EmailVerificationRequestDocument = {
            _id: id,
            userId,
            code,
            email: email.toLowerCase(),
            expirationDate
        };

        await collection.insertOne(requestDocument);

        return {
            id,
            userId,
            code,
            email: email.toLowerCase(),
            expirationDate
        };
    },

    deleteUserEmailVerificationRequests: async (userId: ObjectId): Promise<void> => {
        const collection = await getCollection<EmailVerificationRequestDocument>(DB_NAME, COLLECTION);
        await collection.deleteMany({ userId: userId });
    },

    deleteEmailVerificationRequestById: async (id: string): Promise<void> => {
        const collection = await getCollection<EmailVerificationRequestDocument>(DB_NAME, COLLECTION);
        await collection.deleteOne({ _id: id });
    },

    sendVerificationEmail: (email: string, code: string): void => {
        // TODO: actual verification logic
        console.log(`To ${email}: Your verification code is ${code}`);
        // Example: await sendEmail({ to: email, subject: "Verify your email", text: `Your code: ${code}` });
    },

    setEmailVerificationRequestCookie: (event: RequestEvent, request: EmailVerificationRequest): void => {
        event.cookies.set("email_verification", request.id, {
            httpOnly: true,
            path: "/",
            secure: !dev,
            sameSite: "lax",
            expires: request.expirationDate
        });
    },

    deleteEmailVerificationRequestCookie: (event: RequestEvent): void => {
        event.cookies.set("email_verification", "", {
            httpOnly: true,
            path: "/",
            secure: !dev,
            sameSite: "lax",
            maxAge: 0
        });
    },

    getUserEmailVerificationRequestFromRequest: async (event: RequestEvent): Promise<Nullable<EmailVerificationRequest>> => {
        if (!event?.locals?.user || event?.locals?.user?._id) {
            return null;
        }
        const id = event.cookies.get("email_verification") ?? null;
        if (id === null) {
            return null;
        }
        const userId = event.locals.user._id;

        const request = await EmailVerificationService.getUserEmailVerificationRequest(userId, id);
        if (request === null) {
            EmailVerificationService.deleteEmailVerificationRequestCookie(event);
        } else if (new Date() > request.expirationDate) {
            await EmailVerificationService.deleteEmailVerificationRequestById(request.id);
            EmailVerificationService.deleteEmailVerificationRequestCookie(event);
            return null;
        }
        return request;
    },

    // Rate limiter for sending verification emails (e.g., 3 attempts per 2 minutes per user ID)
    sendVerificationEmailBucket: new ExpiringTokenBucket<string>(3, 60 * 2) // Keyed by userId.toString()
};