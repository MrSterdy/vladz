import type { PageServerLoad } from "./$types";
import { type Actions, error, fail } from "@sveltejs/kit";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import { updateGroupName } from "$lib/server/services/groupService";

const editSchema = z.object({
    name: z.string().max(32)
});

export const load: PageServerLoad = async event => {
    if (event.locals.user?.role !== "HELPER" && event.locals.user?.role !== "ADMIN") {
        throw error(403);
    }

    const { group } = await event.parent();

    const form = await superValidate(editSchema);

    form.data.name = group.name;

    return { form };
};

export const actions = {
    default: async event => {
        const form = await superValidate(event.request, editSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        await updateGroupName(parseInt(event.params["groupId"]!), form.data.name);

        return { form };
    }
} satisfies Actions;
