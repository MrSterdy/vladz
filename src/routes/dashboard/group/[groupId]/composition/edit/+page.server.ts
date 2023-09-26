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
    id: z.bigint()
});

export const load: PageServerLoad = async event => {
    const { groupUser } = await event.parent();

    if (event.locals.user!.role !== "USER" || groupUser?.role === "CURATOR") {
        const form = await superValidate(updateGroupUserSchema);

        return { form };
    }

    throw error(403);
};

export const actions: Actions = {
    promote: async event => {
        const form = await superValidate(event.request, updateGroupUserSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const groupId = parseInt(event.params["groupId"]!);
        const user = await getGroupUser(form.data.id, groupId);
        if (!user) {
            throw error(400);
        }

        if (user.role === "CURATOR") {
            return message(form, "Не удалось повысить в роли пользователя");
        }

        if (user.role === "REDACTOR" && event.locals.user!.role === "USER") {
            return message(form, "Недостаточно прав", { status: 403 });
        }

        await updateGroupUserRole(
            user.id,
            groupId,
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

        const groupId = parseInt(event.params["groupId"]!);
        const user = await getGroupUser(form.data.id, groupId);
        if (!user) {
            throw error(400);
        }

        if (user.role === "APPLICATION") {
            return message(form, "Не удалось понизить в роли пользователя");
        }

        if (user.role === "CURATOR" && event.locals.user!.role === "USER") {
            return message(form, "Недостаточно прав", { status: 403 });
        }

        await updateGroupUserRole(
            user.id,
            groupId,
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

        await removeGroupUser(form.data.id, parseInt(event.params["groupId"]!));

        return { form };
    }
};
