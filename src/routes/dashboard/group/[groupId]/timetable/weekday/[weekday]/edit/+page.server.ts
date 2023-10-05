import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import { updateWeekdayTimetable } from "$lib/server/services/timetableService";
import { getSubjects } from "$lib/server/services/subjectService";

const timetableSchema = z.object({
    offset: z
        .number({
            invalid_type_error: "Начало занятий должно быть числом",
            required_error: "Начало занятий должно быть числом"
        })
        .min(0, "Начало занятий не должно быть отрицательным")
        .max(1440, "Начало занятий не должно превышать сутки (1440)"),
    subjectLength: z
        .number({
            invalid_type_error: "Длина предмета должна быть числом",
            required_error: "Длина предмета должна быть числом"
        })
        .min(0, "Длина предмета не должна быть отрицательной")
        .max(1024, "Длина предмета не должна превышать 1024 минуты"),
    subjectBreak: z
        .number({
            invalid_type_error: "Перемена предмета должна быть числом",
            required_error: "Перемена предмета должна быть числом"
        })
        .min(0, "Перемена предмета не должна быть отрицательной")
        .max(1024, "Перемена предмета не доолжна превышать 1024 минуты"),
    note: z
        .string({ invalid_type_error: "Примечание должно быть строкой" })
        .max(1024, "Примечание не должно превышать 1024 символов")
        .nullable(),
    subjects: z
        .array(
            z.object({
                name: z
                    .string({
                        required_error:
                            "Название предмета не должно быть пустым",
                        invalid_type_error:
                            "Название предмета должно быть строкой"
                    })
                    .max(64, "Название предмета не должно превышать 64 символа")
                    .nullable(),
                length: z
                    .number({
                        required_error: "Длина предмета должна быть числом",
                        invalid_type_error: "Длина предмета должна быть числом"
                    })
                    .min(0, "Длина предмета не должна быть отрицательной")
                    .max(1024, "Длина предмета не должна превышать 1024 минут"),
                break: z
                    .number({
                        required_error: "Перемена предмета должна быть числом",
                        invalid_type_error:
                            "Перемена предмета должна быть числом"
                    })
                    .min(0, "Перемена предмета не должна быть отрицательной")
                    .max(
                        1024,
                        "Перемена предмета не должна превышать 1024 минут"
                    ),
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
                    .nullable(),
                position: z
                    .number({
                        invalid_type_error:
                            "Позиция предмета должна быть числом",
                        required_error: "Позиция предмета должна быть числом"
                    })
                    .min(0, "Позиция предмета не должна быть отрицательной")
                    .max(64, "Позиция предмета не должна быть больше 64")
            }),
            {
                invalid_type_error: "Предметы должны быть массивом",
                required_error: "Предметы должны быть массивом"
            }
        )
        .max(64, "Предметов не должно быть более 64 штук")
});

export const load: PageServerLoad = async event => {
    const { timetable } = await event.parent();

    const form = await superValidate(timetableSchema);

    const subjects = await getSubjects(event.locals.group!.id);

    form.data = timetable;

    return { form, subjects };
};

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, timetableSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const weekday = parseInt(event.params.weekday);

        await updateWeekdayTimetable(event.locals.group!.id, {
            weekday,
            note: form.data.note ?? null,
            offset: form.data.offset,
            subjectBreak: form.data.subjectBreak,
            subjectLength: form.data.subjectLength,
            subjects: form.data.subjects.map(subject => ({
                name: subject.name ?? "",
                length: subject.length,
                break: subject.break,
                teacher: subject.teacher ?? null,
                classroom: subject.classroom ?? null,
                position: subject.position
            }))
        });

        throw redirect(303, "../");
    }
};
