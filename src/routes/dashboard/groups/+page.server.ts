import { fail, error } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms/server";

import type { PageServerLoad, Actions } from "./$types";

import inviteSchema from "$lib/server/schemas/invite";
import { createBucket } from "$lib/server/services/fileService";
import {
    createGroup,
    getGroupByInviteCode,
    getGroups,
    getUserGroups,
    createApplication,
    getUserApplications
} from "$lib/server/services/groupService";
import { sendApplicationNotifications } from "$lib/server/services/notificationService";
import type { Group, List } from "$lib/types";

export const load: PageServerLoad = async event => {
    const type = event.url.searchParams.get("type") || "groups";
    const page = parseInt(event.url.searchParams.get("page") || "1") || 1;

    const inviteForm = await superValidate(inviteSchema);

    const getAll =
        event.locals.user!.role === "ADMIN" ||
        event.locals.user!.role === "HELPER";

    let groups: List<Group>;
    if (type === "applications") {
        groups = await getUserApplications(event.locals.user!.id, page);
    } else {
        const search = event.url.searchParams.get("search") ?? "";

        groups = await (getAll
            ? getGroups(page, search)
            : getUserGroups(event.locals.user!.id, page, search));
    }

    return { groups, inviteForm };
};

export const actions: Actions = {
    join: async event => {
        const inviteForm = await superValidate(event.request, inviteSchema);
        if (!inviteForm.valid) {
            return fail(400, { inviteForm });
        }

        const group = await getGroupByInviteCode(inviteForm.data.invite_code);
        if (!group) {
            throw error(400, { message: "Группа с таким кодом не найдена" });
        }

        const userId = event.locals.user!.id;

        if (group.users.some(u => u.id === userId)) {
            throw error(400, {
                message: "Вы уже состоите в группе с таким кодом"
            });
        }

        if (group.applications.some(u => u.id === userId)) {
            throw error(400, {
                message: "Вы уже подали заявку в группу с таким кодом"
            });
        }

        await createApplication(group.id, userId);

        await sendApplicationNotifications(group.id, group.name);

        setFlash(
            { type: "success", message: "Заявка была успешно отправлена" },
            event
        );
    },
    create: async event => {
        if (
            event.locals.user!.role !== "ADMIN" &&
            event.locals.user!.role !== "HELPER"
        ) {
            throw error(403);
        }

        const inviteCode = await createGroup("Новая группа");
        await createBucket(inviteCode);

        setFlash(
            { type: "success", message: "Новая группа была успешно создана" },
            event
        );
    }
};
