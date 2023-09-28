import { redirect, fail } from "@sveltejs/kit";

import type { PageServerLoad, Actions } from "./$types";

import { z } from "zod";

import { createUser } from "$lib/server/services/userService";
import { superValidate } from "sveltekit-superforms/server";

const formSchema = z.object({
    first_name: z.string().max(64),
    last_name: z.string().max(64)
});

export const load: PageServerLoad = async event => {
    if (event.locals.user) {
        throw redirect(303, "/dashboard");
    }

    const form = await superValidate(formSchema);

    return { form };
}

export const actions: Actions = {
    default: async event => {
        if (event.locals.user) {
            throw redirect(303, "/dashboard");
        }

        const form = await superValidate(event.request, formSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        await createUser({
            id: event.locals.telegramUser!.id,
            firstName: form.data.first_name,
            lastName: form.data.last_name,
            role: "USER"
        });

        throw redirect(303, "/dashboard");
    }
};
