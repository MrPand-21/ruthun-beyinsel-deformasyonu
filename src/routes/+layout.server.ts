import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
    const user = await event.locals.user;

    return {
        username: user ? user.username : null
    };
};