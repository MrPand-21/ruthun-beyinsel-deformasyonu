import { MongoClient, ServerApiVersion, type Document } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

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