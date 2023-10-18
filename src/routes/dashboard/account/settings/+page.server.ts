import { fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";

import type { Actions, PageServerLoad } from "./$types";

import { getUserById, updateUser } from "$lib/server/services/userService";

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
    timetable_notifications: z.boolean({
        invalid_type_error: "Настройка должная быть булевом",
        required_error: "Настройка обязательна"
    })
});

export const load: PageServerLoad = async event => {
    const form = await superValidate(updateAccountSchema);
    const user = event.locals.user!;

    form.data.first_name = user.firstName;
    form.data.last_name = user.lastName;
    form.data.timetable_notifications = user.settings!.notifications.timetable;

    return { form };
};

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, updateAccountSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const user = await getUserById(event.locals.user!.id);
        user!.firstName = form.data.first_name;
        user!.lastName = form.data.last_name;
        user!.settings!.notifications.timetable =
            form.data.timetable_notifications;

        await updateUser(user!);

        throw redirect(
            "../",
            { type: "success", message: "Настройки были изменены" },
            event
        );
    }
};
