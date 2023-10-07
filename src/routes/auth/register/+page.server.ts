import { redirect, fail } from "@sveltejs/kit";

import type { PageServerLoad, Actions } from "./$types";

import { z } from "zod";

import { createUser } from "$lib/server/services/userService";
import { superValidate } from "sveltekit-superforms/server";
import { defaultSettings } from "$lib/defaults";

const formSchema = z.object({
    first_name: z
        .string({
            required_error: "Имя не должно быть пустым",
            invalid_type_error: "Имя должно быть строкой"
        })
        .max(64, "Имя не должно превышать 64 символов"),
    last_name: z.string({
        required_error: "Фамилия не должна быть пустой",
        invalid_type_error: "Фамилия должно быть строкой"
    }).max(64, "Фамилия не должна превышать 64 символов")
});

export const load: PageServerLoad = async event => {
    if (event.locals.user) {
        throw redirect(303, "/dashboard");
    }

    const form = await superValidate(formSchema);

    return { form };
};

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
            role: "USER",
            settings: defaultSettings
        });

        throw redirect(303, "/dashboard");
    }
};
