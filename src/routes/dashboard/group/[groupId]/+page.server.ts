import type { Actions } from "./$types";
import { error } from "@sveltejs/kit";
import { removeUserFromGroup } from "$lib/server/services/groupService";
import { redirect } from "sveltekit-flash-message/server";

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

        throw redirect("/dashboard/groups", { type: "success", message: `Вы покинули группу "${event.locals.group!.name}"` }, event);
    }
};
