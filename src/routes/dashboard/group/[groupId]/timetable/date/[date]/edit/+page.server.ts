import { error, fail } from "@sveltejs/kit";
import dayjs from "dayjs";
import { redirect } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms/server";

import type { Actions, PageServerLoad } from "./$types";

import { maxFiles, maxFileSize } from "$lib/consts";
import { dateTimetableSchema } from "$lib/server/schemas/timetable";
import { deleteFiles, uploadFile } from "$lib/server/services/fileService";
import { getHolidays } from "$lib/server/services/holidayService";
import { sendTimetableNotifications } from "$lib/server/services/notificationService";
import { getSubjects } from "$lib/server/services/subjectService";
import {
    findNextTimetableWithSubject,
    getDateTimetable,
    updateDateTimetable
} from "$lib/server/services/timetableService";
import type { DateSubject, DateTimetable } from "$lib/types";
import { formatISOString, parseDate } from "$lib/utils/time";

export const load: PageServerLoad = async event => {
    const { dateTimetable, weekdayTimetable } = await event.parent();

    const form = await superValidate(dateTimetableSchema);

    form.data = dateTimetable
        ? {
              note: dateTimetable.note,
              offset: dateTimetable.offset,
              sendNotifications: false,
              subjects: dateTimetable.subjects.map(subject => ({
                  name: subject.name,
                  length: subject.length,
                  break: subject.break,
                  classroom: subject.classroom,
                  teacher: subject.teacher,
                  position: subject.position,
                  homeworkText: subject.homework.text,
                  homeworkFiles: subject.homework.files
              }))
          }
        : weekdayTimetable
        ? {
              offset: weekdayTimetable.offset,
              note: null,
              sendNotifications: false,
              subjects: weekdayTimetable.subjects.map(subject => ({
                  name: subject.name,
                  length: subject.length,
                  break: subject.break,
                  classroom: subject.classroom,
                  teacher: subject.teacher,
                  position: subject.position,
                  homeworkText: null,
                  homeworkFiles: null
              }))
          }
        : {
              offset: 0,
              sendNotifications: false,
              note: null,
              subjects: []
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

        const form = await superValidate(formData, dateTimetableSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        type Homework = DateSubject["homework"];
        type HomeworkFile = Homework["files"][number];

        const subjectsWithHomework: string[] = [];

        const files = new Map<number, (File | HomeworkFile)[]>();
        for (const [index, subject] of form.data.subjects.entries()) {
            const filesName = `files-${subject.position}`;

            const newFiles = formData
                .getAll(filesName)
                .slice(0, maxFiles - (subject.homeworkFiles?.length ?? 0))
                .filter(
                    file =>
                        file instanceof File &&
                        file.size > 0 &&
                        file.size <= maxFileSize
                ) as File[];

            const totalFiles =
                newFiles.length + (subject.homeworkFiles?.length ?? 0);

            if (
                !(subject.name ?? "") &&
                (subject.teacher ||
                    subject.classroom ||
                    subject.homeworkText ||
                    totalFiles)
            ) {
                throw error(400, {
                    message:
                        "У предмета с пустым названием не должно быть ДЗ, учителя и кабинета"
                });
            }

            if (totalFiles || subject.homeworkText) {
                if (subjectsWithHomework.includes(subject.name!)) {
                    throw error(400, {
                        message:
                            "Не должно быть больше 1 ДЗ у предметов с одинаковыми названиями в расписании"
                    });
                }

                subjectsWithHomework.push(subject.name!);
            }

            files.set(index, [...newFiles, ...(subject.homeworkFiles ?? [])]);
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

        const newTimetable: DateTimetable = {
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
        };

        const oldTimetable = await getDateTimetable(
            date.toISOString(),
            group.id
        );

        if (oldTimetable) {
            const oldFiles = oldTimetable.subjects
                .filter(s => s.homework.files.length)
                .reduce(
                    (acc, s) => [...acc, ...s.homework.files.map(f => f.url)],
                    [] as string[]
                );

            if (oldFiles) {
                const newFiles = newTimetable.subjects
                    .filter(s => s.homework.files.length)
                    .reduce(
                        (acc, s) => [
                            ...acc,
                            ...s.homework.files.map(f => f.url)
                        ],
                        [] as string[]
                    );

                const removedFiles = oldFiles.filter(
                    f => !newFiles.includes(f)
                );

                await deleteFiles(removedFiles);
            }

            if (!date.isBefore(dayjs(formatISOString(dayjs())))) {
                const removedSubjects: DateSubject[] = [];

                remove: for (const oldSubject of oldTimetable.subjects) {
                    if (
                        !oldSubject.homework.text &&
                        !oldSubject.homework.files.length
                    ) {
                        continue;
                    }

                    for (const newSubject of newTimetable.subjects) {
                        if (newSubject.name === oldSubject.name) {
                            continue remove;
                        }
                    }

                    removedSubjects.push(oldSubject);
                }

                if (removedSubjects.length) {
                    const holidays = await getHolidays(group.id);

                    await Promise.all(
                        removedSubjects.map(async subject => {
                            const nextTimetable =
                                await findNextTimetableWithSubject(
                                    group.id,
                                    subject.name,
                                    date,
                                    holidays
                                );

                            if (!nextTimetable) {
                                return;
                            }

                            const timetable = nextTimetable.timetable;

                            if ("date" in timetable) {
                                if (
                                    timetable.subjects.some(
                                        s =>
                                            s.name === subject.name &&
                                            (s.homework.text ||
                                                s.homework.files.length)
                                    )
                                ) {
                                    return;
                                }

                                const nextSubject = timetable.subjects.find(
                                    s => s.name === subject.name
                                )!;
                                nextSubject.homework = subject.homework;

                                await updateDateTimetable(group.id, timetable);
                            } else {
                                const dateTimetable: DateTimetable = {
                                    date: nextTimetable.date.toISOString(),
                                    offset: timetable.offset,
                                    note: null,
                                    subjects: timetable.subjects.map(s => ({
                                        ...s,
                                        homework: { text: "", files: [] }
                                    }))
                                };

                                const nextSubject = dateTimetable.subjects.find(
                                    s => s.name === subject.name
                                )!;
                                nextSubject.homework = subject.homework;

                                await updateDateTimetable(
                                    group.id,
                                    dateTimetable
                                );
                            }
                        })
                    );
                }
            }
        }

        await updateDateTimetable(group.id, newTimetable);

        if (form.data.sendNotifications) {
            await sendTimetableNotifications(group.id, group.name, date);
        }

        throw redirect(
            "../",
            { type: "success", message: "Расписание было обновлено" },
            event
        );
    }
};
