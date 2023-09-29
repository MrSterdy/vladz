import type { Actions, PageServerLoad } from "./$types";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import { fail, redirect } from "@sveltejs/kit";
import { updateSubjects } from "$lib/server/services/subjectService";

const updateSubjectSchema = z.object({
    subjects: z.array(
        z.object({
            name: z
                .string({
                    required_error: "Название предмета не должно быть пустым",
                    invalid_type_error: "Название предмета должно быть строкой"
                })
                .max(64, "Название предмета не должно превышать 64 символа"),
            teacher: z
                .string({
                    invalid_type_error: "Имя учителя должно быть строкой"
                })
                .max(128, "Имя учителя не должно превышать 128 символов")
                .nullable(),
            classroom: z
                .string({
                    invalid_type_error: "Помещение должно быть строкой"
                })
                .max(64, "Помещение не должно превышать 64 символа")
                .nullable()
        }),
        {
            invalid_type_error: "Предметы должны быть массивом",
            required_error: "Предметы должны быть массивом"
        }
    )
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
