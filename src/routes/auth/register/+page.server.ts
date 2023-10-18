import { fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms/server";

import type { PageServerLoad, Actions } from "./$types";

import { defaultSettings } from "$lib/defaults";
import registerSchema from "$lib/server/schemas/register";
import { createUser } from "$lib/server/services/userService";

export const load: PageServerLoad = async event => {
    if (event.locals.user) {
        throw redirect(303, "/dashboard");
    }

    const form = await superValidate(registerSchema);

    return { form };
};

export const actions: Actions = {
    default: async event => {
        if (event.locals.user) {
            throw redirect(303, "/dashboard");
        }

        const form = await superValidate(event.request, registerSchema);
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

        throw redirect(
            "/dashboard",
            { type: "success", message: "Вы успешно зарегистрировались" },
            event
        );
    }
};
