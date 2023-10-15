import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import {
    deleteGroup,
    updateGroupName
} from "$lib/server/services/groupService";
import { deleteBucket } from "$lib/server/services/fileService";

import groupSchema from "$lib/server/schemas/group";
import { redirect } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async event => {
    const form = await superValidate(groupSchema);

    form.data.name = event.locals.group!.name;

    return { form };
};

export const actions: Actions = {
    delete: async event => {
        const group = event.locals.group!;

        await deleteGroup(group.id);
        await deleteBucket(group.inviteCode);

        throw redirect("/dashboard/groups", { type: "success", message: "Группа была удалена" }, event);
    },
    update: async event => {
        const form = await superValidate(event.request, groupSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        await updateGroupName(event.locals.group!.id, form.data.name);

        throw redirect("../", { type: "success", message: "Информация о группе была обновлена" }, event);
    }
};
