export const load = async (event) => {
    const user = await event.locals.user;

    return {
        username: user ? user.username : null
    };
};