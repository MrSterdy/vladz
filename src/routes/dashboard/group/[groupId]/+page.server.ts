import type { Actions } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { removeUserFromGroup } from "$lib/server/services/groupUserService";

export const actions: Actions = {
    default: async event => {
        if (!event.locals.groupUser) {
            throw error(400, {
                message: "Вы не можете покинуть группу, в которой не находитесь"
            });
        }

        await removeUserFromGroup(
            event.locals.user!.id,
            event.locals.group!.id
        );

        throw redirect(303, "/dashboard/groups");
    }
};
