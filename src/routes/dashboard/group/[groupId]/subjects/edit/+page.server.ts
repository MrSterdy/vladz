import type { Actions, PageServerLoad } from "./$types";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import { error, fail, redirect } from "@sveltejs/kit";
import { updateSubjects } from "$lib/server/services/subjectService";

const updateSubjectSchema = z.object({
    subjects: z.array(z.object({
        name: z.string().max(64),
        teacher: z.string().max(128).nullable(),
        classroom: z.string().max(64).nullable()
    }))
});

export const load: PageServerLoad = async event => {
    const { groupUser, subjects } = await event.parent();

    if (
        event.locals.user!.role !== "USER" ||
        (groupUser &&
            groupUser.role !== "STUDENT" &&
            groupUser.role !== "APPLICATION")
    ) {
        const form = await superValidate(updateSubjectSchema);

        form.data.subjects = subjects;

        return { form };
    }

    throw error(403);
};

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, updateSubjectSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        await updateSubjects(parseInt(event.params.groupId), form.data.subjects);

        throw redirect(303, "../");
    }
};
