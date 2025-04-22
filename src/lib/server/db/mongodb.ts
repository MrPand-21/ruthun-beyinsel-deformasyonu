import { MongoClient, ServerApiVersion } from 'mongodb';
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

        cached.promise = client.connect()
            .then((client) => {
                console.log('MongoDB connected successfully');
                return client;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export function getCollection(database: string, collection: string) {
    return connectToDatabase()
        .then((client) => client.db(database).collection(collection));
}

// Helper function to get database name from MongoDB URI
export function getDatabaseName() {
    const dbName = MONGODB_URI.split('/').pop()?.split('?')[0];
    return dbName || 'app';
}