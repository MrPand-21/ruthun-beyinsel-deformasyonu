import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import Credentials from '@auth/core/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { MongooseAdapter } from "@brendon1555/authjs-mongoose-adapter"
import { MONGODB_URI } from '$env/static/private';

import { User, type UserDocument } from '$lib/server/models/user.model';
import { connectToDatabase } from '$lib/server/db/mongodb';
import { comparePassword } from '$lib/server/utils';

await connectToDatabase().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});


const authorization: Handle = async ({ event, resolve }) => {
    const protectedRoutes = ['/activities', '/send'];
    const isProtectedRoute = protectedRoutes.some(route =>
        event.url.pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        const session = await event.locals.auth();
        if (!session) {
            redirect(303, `/login?callbackUrl=${event.url.pathname}`);
        }
    }

    return resolve(event);
};

export const handle = sequence(
    SvelteKitAuth({
        adapter: MongooseAdapter(MONGODB_URI),
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

                        const user: UserDocument | null = await User.findOne({ email: credentials?.email });

                        if (!user || !credentials?.password) {
                            return null;
                        }

                        const isValid = await comparePassword(user, credentials.password as any);

                        if (!isValid) {
                            return null;
                        }

                        return {
                            id: user._id.toString(),
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
                // Initial sign in
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
        debug: true
    }).handle,
    authorization
);