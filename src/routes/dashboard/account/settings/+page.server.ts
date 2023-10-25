import { fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";

import type { Actions, PageServerLoad } from "./$types";

import { notifications } from "$lib/consts";
import { updateUser } from "$lib/server/services/userService";
import type { Account } from "$lib/types";

const updateAccountSchema = z.object({
    first_name: z
        .string({
            required_error: "Имя не должно быть пустым",
            invalid_type_error: "Имя должно быть строкой"
        })
        .max(64, "Имя не должно превышать 64 символов"),
    last_name: z
        .string({
            required_error: "Фамилия не должна быть пустой",
            invalid_type_error: "Фамилия должно быть строкой"
        })
        .max(64, "Фамилия не должна превышать 64 символов"),
    notifications: z
        .array(z.enum(notifications), {
            invalid_type_error: "Уведомления должны быть массивом",
            required_error: "Уведомления должны быть массивом"
        })
        .refine(
            items => new Set(items).size === items.length,
            "Уведомления должны быть уникальными"
        )
});

export const load: PageServerLoad = async event => {
    const form = await superValidate(updateAccountSchema);
    const user = event.locals.user!;

    form.data.first_name = user.firstName;
    form.data.last_name = user.lastName;
    form.data.notifications = user.settings
        ? (Object.keys(user.settings.notifications).filter(
              key =>
                  user.settings!.notifications[
                      key as keyof NonNullable<Account["settings"]>["notifications"]
                  ]
          ) as (keyof NonNullable<Account["settings"]>["notifications"])[])
        : [];

    return { form };
};

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, updateAccountSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const user = event.locals.user!;
        user!.firstName = form.data.first_name;
        user!.lastName = form.data.last_name;
        if (!user!.settings) {
            user!.settings = { notifications: {} };
        }

        for (const notification of form.data.notifications) {
            user!.settings.notifications[notification] = true;
        }

        for (const notification of notifications) {
            if (!form.data.notifications.includes(notification)) {
                user!.settings.notifications[notification] = false;
            }
        }

        await updateUser(user!);

        throw redirect(
            "../",
            { type: "success", message: "Настройки были изменены" },
            event
        );
    }
};
