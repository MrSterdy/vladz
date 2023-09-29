import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import { updateGroupName } from "$lib/server/services/groupService";

const editSchema = z.object({
    name: z
        .string({
            invalid_type_error: "Имя группы должно быть строкой",
            required_error: "Имя группы не должно быть пустым"
        })
        .max(32, "Имя группы не должно превышать 32 символов")
});

export const load: PageServerLoad = async event => {
    const form = await superValidate(editSchema);

    form.data.name = event.locals.group!.name;

    return { form };
};

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, editSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        await updateGroupName(event.locals.group!.id, form.data.name);

        return { form };
    }
};
