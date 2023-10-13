import { z } from "zod";

import subjectsSchema from "./subjects";

const subjectSchema = z
    .object({
        position: z
            .number({
                invalid_type_error: "Позиция предмета должна быть числом",
                required_error: "Позиция предмета должна быть числом"
            })
            .min(0, "Позиция предмета не должна быть отрицательной")
            .max(64, "Позиция предмета не должна быть больше 64"),
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
                invalid_type_error: "Перемена предмета должна быть числом"
            })
            .min(0, "Перемена предмета не должна быть отрицательной")
            .max(1024, "Перемена предмета не должна превышать 1024 минут")
    })
    .merge(subjectsSchema.shape.subjects.element);

const baseTimetableSchema = z.object({
    offset: z
        .number({
            invalid_type_error: "Начало занятий должно быть числом",
            required_error: "Начало занятий должно быть числом"
        })
        .min(0, "Начало занятий не должно быть отрицательным")
        .max(1440, "Начало занятий не должно превышать сутки (1440)")
});

const weekdayTimetableSchema = z
    .object({
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
        subjects: z.array(subjectSchema, {
            invalid_type_error: "Предметы должны быть массивом",
            required_error: "Предметы должны быть массивом"
        })
    })
    .merge(baseTimetableSchema);

const dateTimetableSchema = z
    .object({
        note: z
            .string({ invalid_type_error: "Примечание должно быть строкой" })
            .max(1024, "Примечание не должно превышать 1024 символов")
            .nullable(),
        subjects: z.array(
            z
                .object({
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
                                    required_error:
                                        "Тип файлы должен быть строкой"
                                }),
                                name: z.string({
                                    invalid_type_error:
                                        "Имя файла должно быть строкой",
                                    required_error:
                                        "Имя файлы должно быть строкой"
                                })
                            }),
                            {
                                invalid_type_error:
                                    "Файлы ДЗ должны быть массивом"
                            }
                        )
                        .nullable()
                })
                .merge(subjectSchema),
            {
                invalid_type_error: "Предметы должны быть массивом",
                required_error: "Предметы должны быть массивом"
            }
        )
    })
    .merge(baseTimetableSchema);

export { weekdayTimetableSchema };
export { dateTimetableSchema };
