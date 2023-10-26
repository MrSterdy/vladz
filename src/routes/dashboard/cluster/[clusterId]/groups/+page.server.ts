import { fail } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms/server";

import type { Actions, PageServerLoad } from "./$types";

import groupAmountSchema from "$lib/server/schemas/groupAmount";
import { createBucket } from "$lib/server/services/fileService";
import {
    createGroups,
    getClusterGroups
} from "$lib/server/services/groupService";

export const load: PageServerLoad = async event => {
    const page = parseInt(event.url.searchParams.get("page") || "1") || 1;
    const search = event.url.searchParams.get("search") ?? "";

    const amountForm = await superValidate(groupAmountSchema);

    const groups = await getClusterGroups(event.locals.groupCluster!.id, page, search);

    return { groups, amountForm };
};

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, groupAmountSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const inviteCodes = await createGroups(
            "Новая группа",
            form.data.amount,
            event.locals.groupCluster!.id
        );
        await Promise.all(
            inviteCodes.map(inviteCode => createBucket(inviteCode))
        );

        setFlash(
            { type: "success", message: "Новые группы были успешно созданы" },
            event
        );
    }
};
