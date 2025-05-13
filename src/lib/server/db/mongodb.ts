import { MongoClient, ServerApiVersion, type Document } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';
import type { UserDocument } from './models/user.model';
import type { SessionDocument } from './models/session.model';
import type { EmailVerificationRequestDocument } from './models/email.verification.model';
import type { PasswordResetSessionDocument } from './models/password.reset.session.model';
import type { ActivityDocument } from './models/activity.model';
import type { MajorDocument } from './models/major.model';
import type { RequirementDocument } from './models/requirement.model';

declare global {
    var mongoClient: {
        conn: MongoClient | null;
        promise: Promise<MongoClient> | null;
    };
}

let cached = globalThis.mongoClient;

if (!cached) {
    cached = globalThis.mongoClient = { conn: null, promise: null };
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const client = new MongoClient(MONGODB_URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        cached.promise = client.connect().then(client => client);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export function getCollection<T extends Document>(database: string, collection: string) {
    return connectToDatabase().then((client) =>
        client.db(database).collection<T>(collection)
    );
}

export function getDatabaseName() {
    const dbName = MONGODB_URI.split('/').pop()?.split('?')[0];
    return dbName || 'app';
}

export async function initializeDatabase() {
    const dbName = getDatabaseName();

    const usersCollection = await getCollection<UserDocument>(dbName, 'users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });

    const sessionsCollection = await getCollection<SessionDocument>(dbName, 'sessions');
    await sessionsCollection.createIndex({ userId: 1 });
    await sessionsCollection.createIndex({ expirationDate: 1 }, { expireAfterSeconds: 0 });

    const activitiesCollection = await getCollection<ActivityDocument>(dbName, 'activities');
    await activitiesCollection.createIndex({ userId: 1 });
    await activitiesCollection.createIndex({ category: 1 });
    await activitiesCollection.createIndex({ "major._id": 1 });
    await activitiesCollection.createIndex({ tags: 1 });

    const majorsCollection = await getCollection<MajorDocument>(dbName, 'majors');
    await majorsCollection.createIndex({ title: 1 }, { unique: true });

    const requirementsCollection = await getCollection<RequirementDocument>(dbName, 'requirements');
    await requirementsCollection.createIndex({ title: 1 }, { unique: true });

    const emailVerificationRequestsCollection = await getCollection<EmailVerificationRequestDocument>(dbName, 'email_verification_requests');
    await emailVerificationRequestsCollection.createIndex({ userId: 1 });
    await emailVerificationRequestsCollection.createIndex({ expirationDate: 1 }, { expireAfterSeconds: 0 });

    const passwordResetSessionsCollection = await getCollection<PasswordResetSessionDocument>(dbName, 'password_reset_sessions');
    await passwordResetSessionsCollection.createIndex({ userId: 1 });
    await passwordResetSessionsCollection.createIndex({ expirationDate: 1 }, { expireAfterSeconds: 0 }); // TTL index for automatic expiration
}