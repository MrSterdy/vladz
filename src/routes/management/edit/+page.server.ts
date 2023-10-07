import type { Actions, PageServerLoad } from "./$types";
import { z } from "zod";
import { message, superValidate } from "sveltekit-superforms/server";
import { error, fail } from "@sveltejs/kit";
import { getUserById, updateUser } from "$lib/server/services/userService";
import { sendPromotionNotification } from "$lib/server/services/notificationService";
import { userRoles } from "$lib/consts";
import { capitalize } from "$lib/utils";

const updateUserRoleSchema = z.object({
    id: z.bigint({
        required_error: "ID пользователя не должно быть пустым",
        invalid_type_error: "ID пользователя должно быть числом"
    })
});

export const load: PageServerLoad = async () => {
    const form = await superValidate(updateUserRoleSchema);

    return { form };
}

export const actions: Actions = {
    promote: async event => {
        const form = await superValidate(event.request, updateUserRoleSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const user = await getUserById(form.data.id);
        if (!user) {
            return message(form, "Пользователь не найден");
        }

        if (user.role !== "USER") {
            return message(form, "Невозможно повысить пользователя");
        }

        user.role = "HELPER";

        await updateUser(user);

        await sendPromotionNotification(user.id, capitalize(userRoles[user.role]));

        return { form };
    },
    demote: async event => {
        const form = await superValidate(event.request, updateUserRoleSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const user = await getUserById(form.data.id);
        if (!user) {
            throw error(400, { message: "Пользователь не найден" });
        }

        if (user.role !== "HELPER") {
            return message(form, "Невозможно понизить пользователя");
        }

        user.role = "USER";

        await updateUser(user);

        await sendPromotionNotification(user.id, capitalize(userRoles[user.role]));

        return { form };
    }
};
