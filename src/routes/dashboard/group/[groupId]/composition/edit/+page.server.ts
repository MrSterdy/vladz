import type { PageServerLoad } from "./$types";
import { type Actions, error, fail } from "@sveltejs/kit";
import { z } from "zod";
import { message, superValidate } from "sveltekit-superforms/server";
import {
    getGroupUser,
    removeGroupUser,
    updateGroupUserRole
} from "$lib/server/services/userGroupService";

const updateGroupUserSchema = z.object({
    id: z.bigint({
        required_error: "ID пользователя не должно быть пустым",
        invalid_type_error: "ID пользователя должно быть числом"
    })
});

export const load: PageServerLoad = async () => {
    const form = await superValidate(updateGroupUserSchema);

    return { form };
};

export const actions: Actions = {
    promote: async event => {
        const form = await superValidate(event.request, updateGroupUserSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const user = await getGroupUser(form.data.id, event.locals.group!.id);
        if (!user) {
            throw error(400, { message: "Пользователь не найден" });
        }

        if (user.role === "CURATOR") {
            return message(form, "Не удалось повысить пользователя в роли");
        }

        if (user.role === "REDACTOR" && event.locals.user!.role === "USER") {
            throw error(403, { message: "Недостаточно прав" });
        }

        await updateGroupUserRole(
            user.id,
            event.locals.group!.id,
            user.role === "REDACTOR"
                ? "CURATOR"
                : user.role === "STUDENT"
                ? "REDACTOR"
                : "STUDENT"
        );

        return { form };
    },
    demote: async event => {
        const form = await superValidate(event.request, updateGroupUserSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const user = await getGroupUser(form.data.id, event.locals.group!.id);
        if (!user) {
            throw error(400, { message: "Пользователь не найден" });
        }

        if (user.role === "APPLICATION") {
            return message(form, "Не удалось понизить пользователя в роли");
        }

        if (user.role === "CURATOR" && event.locals.user!.role === "USER") {
            throw error(403, { message: "Недостаточно прав" });
        }

        await updateGroupUserRole(
            user.id,
            event.locals.group!.id,
            user.role === "CURATOR"
                ? "REDACTOR"
                : user.role === "REDACTOR"
                ? "STUDENT"
                : "APPLICATION"
        );

        return { form };
    },
    remove: async event => {
        const form = await superValidate(event.request, updateGroupUserSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const user = await getGroupUser(form.data.id, event.locals.group!.id);
        if (!user) {
            throw error(400, { message: "Пользователь не найден" });
        }

        if (user.role === "CURATOR" && event.locals.user!.role === "USER") {
            throw error(403, { message: "Недостаточно прав" });
        }

        await removeGroupUser(form.data.id, event.locals.group!.id);

        return { form };
    }
};
