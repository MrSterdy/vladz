import { z } from "zod";

const registerSchema = z.object({
    first_name: z
        .string({
            required_error: "Имя не должно быть пустым",
            invalid_type_error: "Имя должно быть строкой"
        })
        .max(64, "Имя не должно превышать 64 символов"),
    last_name: z
        .string({
            required_error: "Фамилия не должна быть пустой",
            invalid_type_error: "Фамилия должно быть строкой"
        })
        .max(64, "Фамилия не должна превышать 64 символов")
});

export default registerSchema;
