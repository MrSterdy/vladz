import type { LayoutServerLoad } from "./$types";

import { getManagement } from "$lib/server/services/userService";

export const load: LayoutServerLoad = async event => {
    const management = await getManagement();
    const user = event.locals.user;

    return { management, user };
};
