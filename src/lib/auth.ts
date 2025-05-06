import { AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, MONGODB_URI } from "$env/static/private";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/sveltekit/providers/google";

import { MongoClient } from 'mongodb';
import { connectToDatabase } from "./server/db/mongodb";
import Credentials from "@auth/sveltekit/providers/credentials";
import { UserService } from "./server/models/user.model";

const client = new MongoClient(MONGODB_URI);
const clientPromise = client.connect();

await connectToDatabase().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});


export const { signIn, signOut, handle: SvelteKitAuthHandle } = SvelteKitAuth({
    trustHost: true,
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        Google({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    provider: 'google',
                    providerId: profile.sub
                };
            }
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        console.log("Missing email or password");
                        return null;
                    }

                    const user = await UserService.findByEmail((credentials.email as string).toLowerCase());

                    if (!user) {
                        console.log("User not found");
                        return null;
                    }

                    console.log("Comparing passwords for login:", {
                        hasPassword: !!user.password,
                        inputLength: (credentials.password as string).length
                    });

                    const isValid = await UserService.verifyPassword(
                        (credentials.password as string),
                        user.password || ''
                    );

                    if (!isValid) {
                        console.log("Password verification failed");
                        return null;
                    }

                    return {
                        id: user._id!.toString(),
                        email: user.email,
                        name: user.name,
                        image: user.image
                    };
                } catch (error) {
                    console.error('Error in authorize:', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                return {
                    ...token,
                    userId: user.id,
                    provider: account.provider
                };
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.userId as string;
                // session.user.provider = token.provider as string;
            }
            return session;
        }
    },
    session: {
        strategy: 'jwt'
    },
    secret: AUTH_SECRET,
    debug: true,
    pages: {
        signIn: "/login",
        signOut: "/login",
        newUser: "/register"
    }
})