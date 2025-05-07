export const load = async (event) => {
    const session = await event.locals.session;

    return {
        session
    };
};