import { z } from "zod";

const groupAmountSchema = z.object({
    amount: z
        .number({
            required_error: "Количество групп должно быть числом",
            invalid_type_error: "Количество групп должно быть числом"
        })
        .min(1, "Количество групп не должно быть меньше или равно 0")
        .max(512, "Количество групп не должно быть более 512 штук")
        .default(1)
});

export default groupAmountSchema;
