import type { PageServerLoad } from "./activities/$types";

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();

    return {
        session
    };
};