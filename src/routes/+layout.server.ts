import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
    const session = await event.locals.auth.validate();

    return {
        user: session ? session.user : null
    };
};