import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { message, superValidate } from "sveltekit-superforms/server";
import { updateDateTimetable } from "$lib/server/services/timetableService";
import { parseDate } from "$lib/utils";
import { getSubjects } from "$lib/server/services/subjectService";
import { sendTimetableNotifications } from "$lib/server/services/notificationService";
import { MAX_FILES } from "$env/static/private";
import type { DateSubject } from "$lib/types";
import { uploadFile } from "$lib/server/services/fileService";

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
                homeworkText: z
                    .string({
                        invalid_type_error:
                            "Домашнее задание должно быть строкой"
                    })
                    .max(
                        2048,
                        "Домашнее задание не должно превышать 2048 символов"
                    )
                    .nullable(),
                homeworkFiles: z
                    .array(
                        z.object({
                            url: z
                                .string({
                                    invalid_type_error:
                                        "Ссылка на файл является в неправильном формате",
                                    required_error:
                                        "Ссылка на файл является в неправильном формате"
                                })
                                .url(
                                    "Ссылка на файл является в неправильном формате"
                                ),
                            type: z.string({
                                invalid_type_error:
                                    "Тип файла должен быть строкой",
                                required_error: "Тип файлы должен быть строкой"
                            }),
                            name: z.string({
                                invalid_type_error:
                                    "Имя файла должно быть строкой",
                                required_error: "Имя файлы должно быть строкой"
                            })
                        }),
                        {
                            invalid_type_error: "Файлы ДЗ должны быть массивом"
                        }
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

    form.data = dateTimetable
        ? {
              ...dateTimetable,
              subjects: dateTimetable.subjects.map(subject => ({
                  ...subject,
                  homeworkText: subject.homework.text,
                  homeworkFiles: subject.homework.files
              }))
          }
        : {
              ...weekdayTimetable!,
              subjects: weekdayTimetable!.subjects.map(subject => ({
                  ...subject,
                  homeworkText: null,
                  homeworkFiles: null
              }))
          };

    const subjects = await getSubjects(event.locals.group!.id);

    return { form, subjects };
};

export const actions: Actions = {
    default: async event => {
        const date = parseDate(event.params.date);
        if (!date.isValid()) {
            throw error(400, { message: "Неправильный формат даты" });
        }

        const formData = await event.request.formData();

        const form = await superValidate(formData, timetableSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        type Homework = DateSubject["homework"];
        type HomeworkFile = Homework["files"][number];

        const files = new Map<number, (File | HomeworkFile)[]>();
        for (const [index, subject] of form.data.subjects.entries()) {
            const filesName = `files-${subject.position}`;

            const newFiles = formData.getAll(filesName);
            if (newFiles.some(file => !(file instanceof File))) {
                return message(form, "Новые файлы в ДЗ не должны быть строкой");
            }

            if (
                newFiles.length + (subject.homeworkFiles?.length ?? 0) >
                parseInt(MAX_FILES)
            ) {
                return message(
                    form,
                    `Можно загружать максимум ${MAX_FILES} файлов за 1 предмет`
                );
            }

            files.set(index, [
                ...(newFiles as File[]),
                ...(subject.homeworkFiles ?? [])
            ]);
        }

        const group = event.locals.group!;

        const homeworks = new Map<number, Homework>();
        for (const [subjectIndex, homeworkFiles] of files) {
            const subject = form.data.subjects[subjectIndex];

            const uploadedFiles = await Promise.all(
                homeworkFiles.map(async file => {
                    if (file instanceof File) {
                        const url = await uploadFile(group.inviteCode, file);

                        return { url, name: file.name, type: file.type };
                    }

                    return file;
                })
            );

            const homework: Homework = {
                text: subject.homeworkText ?? "",
                files: uploadedFiles
            };

            homeworks.set(subjectIndex, homework);
        }

        await updateDateTimetable(group.id, {
            date: date.toISOString(),
            offset: form.data.offset,
            note: form.data.note,
            subjects: form.data.subjects.map((subject, index) => ({
                name: subject.name ?? "",
                length: subject.length,
                break: subject.break,
                teacher: subject.teacher,
                classroom: subject.classroom,
                position: subject.position,
                homework: homeworks.get(index)!
            }))
        });

        await sendTimetableNotifications(group.id, group.name, date);

        throw redirect(303, "../");
    }
};
