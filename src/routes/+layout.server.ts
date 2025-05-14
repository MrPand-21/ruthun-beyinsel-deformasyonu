import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ locals }) => {

    const user = locals.user;
    if (!user || !user.username || !user.email) { return null; }

    return {
        user: {
            username: user.username,
            email: user.email,
        },
    };
};

