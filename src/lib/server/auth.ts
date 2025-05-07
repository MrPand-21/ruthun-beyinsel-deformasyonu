import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { connectToDatabase, getDatabaseName } from "$lib/server/db/mongodb";
import { Google } from "arctic";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";

const client = await connectToDatabase();
const db = client.db(getDatabaseName());

const adapter = new MongodbAdapter(
    db.collection("users"),
    db.collection("sessions"),
);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: !dev
        }
    },
    getUserAttributes: (attributes) => {
        return {
            // attributes has the type of DatabaseUserAttributes
            username: attributes.username
        };
    }

});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    username: string;
}

export const googleAuth = new Google(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${dev ? "http://localhost:5173" : "https://psrobert.com"}/login/google/callback`
);