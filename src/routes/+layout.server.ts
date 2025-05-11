import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {

    const user = locals.user;


    return {
        username: user ? user.username : null,
        email: user ? user.email : null,
    };
};

