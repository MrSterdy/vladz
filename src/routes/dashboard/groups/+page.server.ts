import { type RequestEvent, type Actions, fail } from "@sveltejs/kit";
import { z } from "zod";
import { superValidate, message } from "sveltekit-superforms/server";

import { addUserToGroup, getUserGroups } from "$lib/server/services/userGroupService";
import { getGroupByInviteCode } from "$lib/server/services/groupService";

const inviteScheme = z.object({
    invite_code: z.string().length(16)
});

export async function load(event: RequestEvent) {
    const inviteForm = await superValidate(inviteScheme);

    const groups = await getUserGroups(event.locals.user!.id);

    return { groups, inviteForm };
}

export const actions = {
    default: async (event) => {
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

        return { inviteForm };
    }
} satisfies Actions;
