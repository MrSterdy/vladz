import { error, fail } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms/server";

import type { Actions, PageServerLoad } from "./$types";

import { userRoles } from "$lib/consts";
import idSchema from "$lib/server/schemas/id";
import { sendPromotionNotification } from "$lib/server/services/notificationService";
import {
    getUserById,
    searchUsers,
    updateUser
} from "$lib/server/services/userService";
import type { List, User } from "$lib/types";
import { capitalize } from "$lib/utils/string";

export const load: PageServerLoad = async event => {
    const form = await superValidate(idSchema);

    let search: List<User> | null = null;
    const searchInput = event.url.searchParams.get("search");
    if (searchInput) {
        const page = parseInt(event.url.searchParams.get("page") || "1") || 1;

        search = await searchUsers(searchInput, page);
    }

    return { form, search: search ?? { items: [], page: 1, total: 0 } };
};

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

        await sendPromotionNotification(
            user.id,
            capitalize(userRoles[user.role])
        );

        setFlash(
            {
                type: "success",
                message: `${user.lastName} ${user.firstName} был(-а) повышен(-а)`
            },
            event
        );

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

        await sendPromotionNotification(
            user.id,
            capitalize(userRoles[user.role])
        );

        setFlash(
            {
                type: "success",
                message: `${user.lastName} ${user.firstName} был(-а) понижен(-а)`
            },
            event
        );

        return { form };
    }
};
