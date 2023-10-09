import { z } from "zod";

const groupSchema = z.object({
    name: z
        .string({
            invalid_type_error: "Имя группы должно быть строкой",
            required_error: "Имя группы не должно быть пустым"
        })
        .max(32, "Имя группы не должно превышать 32 символов")
});

export default groupSchema;
