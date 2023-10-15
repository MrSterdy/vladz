import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { error, fail } from "@sveltejs/kit";
import { getUserById, updateUser } from "$lib/server/services/userService";
import { sendPromotionNotification } from "$lib/server/services/notificationService";
import { userRoles } from "$lib/consts";
import { capitalize } from "$lib/utils/string";
import idSchema from "$lib/server/schemas/id";
import { setFlash } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async () => {
    const form = await superValidate(idSchema);

    return { form };
}

export const actions: Actions = {
    promote: async event => {
        const form = await superValidate(event.request, idSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const user = await getUserById(form.data.id);
        if (!user) {
            throw error(400, { message: "Пользователь не найден" });
        }

        if (user.role !== "USER") {
            throw error(400, { message: "Не удалось повысить пользователя" });
        }

        user.role = "HELPER";

        await updateUser(user);

        await sendPromotionNotification(user.id, capitalize(userRoles[user.role]));

        setFlash({ type: "success", message: `${user.lastName} ${user.firstName} был(-а) повышен(-а)` }, event);

        return { form };
    },
    demote: async event => {
        const form = await superValidate(event.request, idSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const user = await getUserById(form.data.id);
        if (!user) {
            throw error(400, { message: "Пользователь не найден" });
        }

        if (user.role !== "HELPER") {
            throw error(400, { message: "Не удалось понизить пользователя" });
        }

        user.role = "USER";

        await updateUser(user);

        await sendPromotionNotification(user.id, capitalize(userRoles[user.role]));

        setFlash({ type: "success", message: `${user.lastName} ${user.firstName} был(-а) понижен(-а)` }, event);

        return { form };
    }
};
