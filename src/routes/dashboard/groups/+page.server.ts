import { fail, error, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { z } from "zod";
import { superValidate, message } from "sveltekit-superforms/server";

import { addUserToGroup, getUserGroups } from "$lib/server/services/userGroupService";
import { createGroup, getGroupByInviteCode, getGroups } from "$lib/server/services/groupService";

const inviteScheme = z.object({
    invite_code: z.string({
        required_error: "Код приглашения не должен быть пустым",
        invalid_type_error: "Код приглашения должен быть строкой"
    }).length(16, "Код приглашения должен состоять из 16 символов")
});

export const load: PageServerLoad = async event => {
    const inviteForm = await superValidate(inviteScheme);

    const getAll = event.locals.user!.role === "ADMIN" || event.locals.user!.role === "HELPER";

    const groups = getAll ? await getGroups() : await getUserGroups(event.locals.user!.id);

    return { groups, inviteForm };
}

export const actions: Actions = {
    join: async (event) => {
        const inviteForm = await superValidate(event.request, inviteScheme);
        if (!inviteForm.valid) {
            return fail(400, { inviteForm });
        }

        const group = await getGroupByInviteCode(inviteForm.data.invite_code);
        if (!group) {
            return message(inviteForm, "Группа с таким кодом приглашения не найдена");
        }

        if (group.users.some(u => u.id === event.locals.user!.id)) {
            return message(inviteForm, "Вы уже состоите в группе с таким кодом");
        }

        await addUserToGroup(event.locals.user!.id, group.id);

        throw redirect(303, `/dashboard/group/${group.id}`);
    },
    create: async (event) => {
        if (event.locals.user!.role !== "ADMIN" && event.locals.user!.role !== "HELPER") {
            throw error(403);
        }

        await createGroup("Новая группа");
    }
};
