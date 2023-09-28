import type { Actions, PageServerLoad } from "./$types";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import { fail, redirect } from "@sveltejs/kit";
import { updateSubjects } from "$lib/server/services/subjectService";

const updateSubjectSchema = z.object({
    subjects: z.array(z.object({
        name: z.string().max(64),
        teacher: z.string().max(128).nullable(),
        classroom: z.string().max(64).nullable()
    }))
});

export const load: PageServerLoad = async event => {
    const { subjects } = await event.parent();

    const form = await superValidate(updateSubjectSchema);

    form.data.subjects = subjects;

    return { form };
};

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, updateSubjectSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        await updateSubjects(event.locals.group!.id, form.data.subjects);

        throw redirect(303, "../");
    }
};
