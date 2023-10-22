import { z } from "zod";

const subjectsSchema = z.object({
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
        .max(64, "Количество предметов не должно превышать 64 штуки")
});

export default subjectsSchema;
