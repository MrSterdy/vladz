import { redirect, type RequestEvent, type Actions, fail } from "@sveltejs/kit";

import { z } from "zod";

import { createUser } from "$lib/server/services/userService";
import { superValidate } from "sveltekit-superforms/server";

const formSchema = z.object({
    first_name: z.string().max(64),
    last_name: z.string().max(64)
});

export async function load(event: RequestEvent) {
    if (event.locals.user) {
        throw redirect(303, "/dashboard");
    }

    const form = await superValidate(formSchema);

    return { form };
}

export const actions = {
    default: async (event) => {
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
} satisfies Actions;
