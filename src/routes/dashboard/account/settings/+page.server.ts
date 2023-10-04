import { z } from "zod";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { fail, redirect } from "@sveltejs/kit";
import { getUserById, updateUser } from "$lib/server/services/userService";

const updateAccountSchema = z.object({
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
    const form = await superValidate(updateAccountSchema);
    const user = event.locals.user!;

    form.data.first_name = user.firstName;
    form.data.last_name = user.lastName;

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

        await updateUser(user!);

        throw redirect(303, "../");
    }
};
