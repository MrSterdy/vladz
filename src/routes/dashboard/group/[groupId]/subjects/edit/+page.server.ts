import { error, fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";

import type { Actions, PageServerLoad } from "./$types";

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

        if (
            new Set(form.data.subjects.map(s => s.name)).size !==
            form.data.subjects.length
        ) {
            throw error(400, {
                message: "Название предметов должно быть уникальным"
            });
        }

        await updateSubjects(event.locals.group!.id, form.data.subjects);

        throw redirect(
            "../",
            { type: "success", message: "Предметы были обновлены" },
            event
        );
    }
};
