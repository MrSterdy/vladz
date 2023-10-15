import { fail, error, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { superValidate, message } from "sveltekit-superforms/server";

import { addUserToGroup, getUserGroups } from "$lib/server/services/groupUserService";
import { createGroup, getGroupByInviteCode, getGroups } from "$lib/server/services/groupService";
import {
    sendApplicationNotifications,
    sendApplicationStateNotification
} from "$lib/server/services/notificationService";
import { createBucket } from "$lib/server/services/fileService";
import inviteSchema from "$lib/server/schemas/invite";

export const load: PageServerLoad = async event => {
    const inviteForm = await superValidate(inviteSchema);

    const getAll = event.locals.user!.role === "ADMIN" || event.locals.user!.role === "HELPER";

    const groups = getAll ? await getGroups() : await getUserGroups(event.locals.user!.id);

    return { groups, inviteForm };
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
            return message(inviteForm, "Вы уже состоите в группе с таким кодом");
        }

        await addUserToGroup(userId, group.id);

        await Promise.all([
            sendApplicationStateNotification(userId, "sent", group.name),
            sendApplicationNotifications(group.id, group.name)
        ]);

        throw redirect(303, `/dashboard/group/${group.id}`);
    },
    create: async (event) => {
        if (event.locals.user!.role !== "ADMIN" && event.locals.user!.role !== "HELPER") {
            throw error(403);
        }

        const group = await createGroup("Новая группа");
        await createBucket(group.inviteCode);
    }
};
