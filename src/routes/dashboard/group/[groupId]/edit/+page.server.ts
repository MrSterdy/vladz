import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import {
    deleteGroup,
    updateGroupName
} from "$lib/server/services/groupService";
import { deleteBucket } from "$lib/server/services/fileService";

import groupSchema from "$lib/server/schemas/group";

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

        throw redirect(303, "/dashboard/groups");
    },
    update: async event => {
        const form = await superValidate(event.request, groupSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        await updateGroupName(event.locals.group!.id, form.data.name);

        throw redirect(303, "../");
    }
};
