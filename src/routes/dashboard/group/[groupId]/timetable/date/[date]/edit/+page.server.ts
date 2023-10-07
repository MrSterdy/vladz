import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import { updateDateTimetable } from "$lib/server/services/timetableService";
import { parseDate } from "$lib/utils";
import { getSubjects } from "$lib/server/services/subjectService";
import { sendTimetableNotifications } from "$lib/server/services/notificationService";

const timetableSchema = z.object({
    offset: z
        .number({
            invalid_type_error: "Начало занятий должно быть числом",
            required_error: "Начало занятий должно быть числом"
        })
        .min(0, "Начало занятий не должно быть отрицательным")
        .max(1440, "Начало занятий не должно превышать сутки (1440)"),
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
                    .max(64, "Позиция предмета не должна быть больше 64"),
                homework: z
                    .string({
                        invalid_type_error:
                            "Домашнее задание должно быть строкой"
                    })
                    .max(
                        2048,
                        "Домашнее задание не должно превышать 2048 символов"
                    )
                    .nullable()
            }),
            {
                invalid_type_error: "Предметы должны быть массивом",
                required_error: "Предметы должны быть массивом"
            }
        )
        .max(64, "Предметов не должно быть более 64 штук")
});

export const load: PageServerLoad = async event => {
    const { dateTimetable, weekdayTimetable } = await event.parent();

    const form = await superValidate(timetableSchema);

    form.data = dateTimetable ?? {
        ...weekdayTimetable!,
        subjects: weekdayTimetable!.subjects.map(subject => ({
            ...subject,
            homework:
                "homework" in subject ? (subject.homework as string) : null
        }))
    };

    const subjects = await getSubjects(event.locals.group!.id);

    return { form, subjects };
};

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, timetableSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const date = parseDate(event.params.date);
        if (!date.isValid()) {
            throw error(400, { message: "Неправильный формат даты" });
        }

        const group = event.locals.group!;

        await updateDateTimetable(group.id, {
            date: date.toISOString(),
            offset: form.data.offset,
            note: form.data.note,
            subjects: form.data.subjects.map(subject => ({
                name: subject.name ?? "",
                length: subject.length,
                break: subject.break,
                teacher: subject.teacher,
                classroom: subject.classroom,
                position: subject.position,
                homework: subject.homework
            }))
        });

        await sendTimetableNotifications(group.id, group.name, date);

        throw redirect(303, "../");
    }
};
