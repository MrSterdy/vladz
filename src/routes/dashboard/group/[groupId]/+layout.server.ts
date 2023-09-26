import { error } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

import { getGroupById } from "$lib/server/services/groupService";

export const load: LayoutServerLoad = async (event) => {
    const groupId = parseInt(event.params.groupId);

    const group = await getGroupById(groupId);
    if (!group) {
        throw error(400, { message: "Группа не найдена" });
    }

    const groupUser = group.users.find(gu => gu.id === event.locals.user?.id);
    if (!groupUser && event.locals.user?.role === "USER") {
        throw error(403);
    }

    return { group, groupUser };
};