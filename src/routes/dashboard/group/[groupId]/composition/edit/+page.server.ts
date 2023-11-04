import { type Actions, error, fail } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms/server";

import type { PageServerLoad } from "./$types";

import { groupUserRoles } from "$lib/consts";
import idSchema from "$lib/server/schemas/id";
import {
    addUserToGroup,
    removeApplication,
    removeGroupUser,
    updateGroupUserRole
} from "$lib/server/services/groupService";
import {
    sendApplicationStateNotification,
    sendKickNotification,
    sendPromotionNotification
} from "$lib/server/services/notificationService";
import { capitalize } from "$lib/utils/string";

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
        const user = group.users.find(x => x.id === form.data.id);

        if (!user) {
            throw error(400, { message: "Пользователь не найден" });
        }

        if (user.role === "CURATOR") {
            throw error(400, { message: "Не удалось повысить участника" });
        }

        if (
            (user.role === "MONITOR" || user.role === "HELPER") &&
            event.locals.user!.role === "USER"
        ) {
            throw error(403, { message: "Недостаточно прав" });
        }

        const newRole =
            user.role === "MONITOR"
                ? "CURATOR"
                : user.role === "HELPER"
                ? "MONITOR"
                : "HELPER";

        await updateGroupUserRole(user.id, group.id, newRole);

        await sendPromotionNotification(
            user.id,
            capitalize(groupUserRoles[newRole]),
            group.name
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

        const group = event.locals.group!;
        const user = group.users.find(x => x.id === form.data.id);

        if (!user) {
            throw error(400, { message: "Пользователь не найден" });
        }

        if (user.role === "MEMBER") {
            throw error(400, "Не удалось понизить участника");
        }

        if (
            (user.role === "CURATOR" || user.role === "MONITOR") &&
            event.locals.user!.role === "USER"
        ) {
            throw error(403, { message: "Недостаточно прав" });
        }

        const newRole =
            user.role === "CURATOR"
                ? "MONITOR"
                : user.role === "MONITOR"
                ? "HELPER"
                : "MEMBER";

        await updateGroupUserRole(user.id, group.id, newRole);

        await sendPromotionNotification(
            user.id,
            capitalize(groupUserRoles[newRole]),
            group.name
        );

        setFlash(
            {
                type: "success",
                message: `${user.lastName} ${user.firstName} был(-а) понижен(-а)`
            },
            event
        );

        return { form };
    },
    remove: async event => {
        const form = await superValidate(event.request, idSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const group = event.locals.group!;
        const user = group.users.find(x => x.id === form.data.id);

        if (!user) {
            throw error(400, { message: "Пользователь не найден" });
        }

        if (
            (user.role === "CURATOR" || user.role === "MONITOR") &&
            event.locals.user!.role === "USER"
        ) {
            throw error(403, { message: "Недостаточно прав" });
        }

        await removeGroupUser(user.id, group.id);

        await sendKickNotification(user.id, group.name);

        setFlash(
            {
                type: "success",
                message: `${user.lastName} ${user.firstName} был(-а) изгнан(-а)`
            },
            event
        );

        return { form };
    },
    accept: async event => {
        const form = await superValidate(event.request, idSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const group = event.locals.group!;
        const application = group.applications.find(a => a.id === form.data.id);

        if (!application) {
            throw error(400, { message: "Пользователь не подавал заявку" });
        }

        const user = group.users.find(x => x.id === form.data.id);

        if (user) {
            throw error(400, { message: "Пользователь уже состоит в группе" });
        }

        await Promise.all([
            removeApplication(group.id, form.data.id),
            addUserToGroup(form.data.id, group.id)
        ]);

        await sendApplicationStateNotification(
            form.data.id,
            "accepted",
            group.name
        );

        setFlash(
            {
                type: "success",
                message: `${application.lastName} ${application.firstName} был(-а) принят(-а)`
            },
            event
        );

        return { form };
    },
    deny: async event => {
        const form = await superValidate(event.request, idSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const group = event.locals.group!;
        const application = group.applications.find(a => a.id === form.data.id);

        if (!application) {
            throw error(400, { message: "Пользователь не подавал заявку" });
        }

        const user = group.users.find(x => x.id === form.data.id);

        if (user) {
            throw error(400, { message: "Пользователь уже состоит в группе" });
        }

        await removeApplication(group.id, form.data.id);

        await sendApplicationStateNotification(
            form.data.id,
            "denied",
            group.name
        );

        setFlash(
            {
                type: "success",
                message: `${application.lastName} ${application.firstName} был(-а) отклонен(-а)`
            },
            event
        );

        return { form };
    }
};
