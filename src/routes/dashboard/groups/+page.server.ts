import { fail, error } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { superValidate, message } from "sveltekit-superforms/server";

import {
    createGroup,
    getGroupByInviteCode,
    getGroups,
    getUserGroups,
    createApplication, getUserApplications
} from "$lib/server/services/groupService";
import {
    sendApplicationNotifications,
    sendApplicationStateNotification
} from "$lib/server/services/notificationService";
import { createBucket } from "$lib/server/services/fileService";
import inviteSchema from "$lib/server/schemas/invite";

export const load: PageServerLoad = async event => {
    const inviteForm = await superValidate(inviteSchema);

    const getAll = event.locals.user!.role === "ADMIN" || event.locals.user!.role === "HELPER";

    const [groups, applications] = await Promise.all([
        getAll ? getGroups() : getUserGroups(event.locals.user!.id),
        getUserApplications(event.locals.user!.id)
    ]);

    return { groups, applications, inviteForm };
}

export const actions: Actions = {
    join: async (event) => {
        const inviteForm = await superValidate(event.request, inviteSchema);
        if (!inviteForm.valid) {
            return fail(400, { inviteForm });
        }

        const group = await getGroupByInviteCode(inviteForm.data.invite_code);
        if (!group) {
            return message(inviteForm, "Группа с таким кодом приглашения не найдена");
        }

        const userId = event.locals.user!.id;

        if (group.users.some(u => u.id === userId)) {
            return message(inviteForm, "Вы уже состоите в этой группе");
        }

        if (group.applications.some(u => u.id === userId)) {
            return message(inviteForm, "Вы уже подали заявку в эту группу");
        }

        await createApplication(group.id, userId);

        await Promise.all([
            sendApplicationStateNotification(userId, "sent", group.name),
            sendApplicationNotifications(group.id, group.name)
        ]);

        return { inviteForm };
    },
    create: async (event) => {
        if (event.locals.user!.role !== "ADMIN" && event.locals.user!.role !== "HELPER") {
            throw error(403);
        }

        const group = await createGroup("Новая группа");
        await createBucket(group.inviteCode);
    }
};
