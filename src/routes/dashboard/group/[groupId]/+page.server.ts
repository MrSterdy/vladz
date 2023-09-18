import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

import { getGroupById } from "$lib/server/services/groupService";

export const load: PageServerLoad = async (event) => {
    const groupId = parseInt(event.params.groupId);

    const group = await getGroupById(groupId);
    if (!group) {
        throw error(400, { message: "Группа не найдена" });
    }

    return { group };
};