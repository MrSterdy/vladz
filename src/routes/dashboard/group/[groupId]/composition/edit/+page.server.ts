import type { PageServerLoad } from "./$types";
import { type Actions, error, fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/server";
import {
    getGroupUser,
    removeGroupUser,
    updateGroupUserRole
} from "$lib/server/services/userGroupService";
import {
    sendApplicationStateNotification,
    sendKickNotification,
    sendPromotionNotification
} from "$lib/server/services/notificationService";
import { groupUserRoles } from "$lib/consts";
import { capitalize } from "$lib/utils/string";
import idSchema from "$lib/server/schemas/id";

export const load: PageServerLoad = async () => {
    const form = await superValidate(idSchema);

    return { form };
};

export const actions: Actions = {
    promote: async event => {
        const form = await superValidate(event.request, idSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const group = event.locals.group!;

        const user = await getGroupUser(form.data.id, group.id);
        if (!user) {
            throw error(400, { message: "Пользователь не найден" });
        }

        if (user.role === "CURATOR") {
            return message(form, "Не удалось повысить пользователя в роли");
        }

        if (user.role === "EDITOR" && event.locals.user!.role === "USER") {
            throw error(403, { message: "Недостаточно прав" });
        }

        const newRole =
            user.role === "EDITOR"
                ? "CURATOR"
                : user.role === "MEMBER"
                ? "EDITOR"
                : "MEMBER";

        await updateGroupUserRole(user.id, group.id, newRole);

        if (newRole === "MEMBER") {
            await sendApplicationStateNotification(user.id, "accepted", group.name);
        } else {
            await sendPromotionNotification(
                user.id,
                capitalize(groupUserRoles[newRole]),
                group.name
            );
        }

        return { form };
    },
    demote: async event => {
        const form = await superValidate(event.request, idSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const group = event.locals.group!;

        const user = await getGroupUser(form.data.id, group.id);
        if (!user) {
            throw error(400, { message: "Пользователь не найден" });
        }

        if (user.role === "MEMBER") {
            return message(form, "Не удалось понизить пользователя в роли");
        }

        if (user.role === "CURATOR" && event.locals.user!.role === "USER") {
            throw error(403, { message: "Недостаточно прав" });
        }

        const newRole = user.role === "CURATOR" ? "EDITOR" : "MEMBER";

        await updateGroupUserRole(user.id, group.id, newRole);

        await sendPromotionNotification(
            user.id,
            capitalize(groupUserRoles[newRole]),
            group.name
        );

        return { form };
    },
    remove: async event => {
        const form = await superValidate(event.request, idSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const group = event.locals.group!;

        const user = await getGroupUser(form.data.id, group.id);
        if (!user) {
            throw error(400, { message: "Пользователь не найден" });
        }

        if (user.role === "CURATOR" && event.locals.user!.role === "USER") {
            throw error(403, { message: "Недостаточно прав" });
        }

        await removeGroupUser(user.id, group.id);

        if (user.role === "APPLICATION") {
            await sendApplicationStateNotification(
                user.id,
                "denied",
                group.name
            );
        } else {
            await sendKickNotification(user.id, group.name);
        }

        return { form };
    }
};
