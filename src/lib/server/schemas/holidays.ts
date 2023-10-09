import { z } from "zod";

const holidaysSchema = z.object({
    holidays: z.array(
        z.object({
            startDate: z
                .string({
                    invalid_type_error: "Выходной должен быть строкой",
                    required_error: "Выходной не должен быть пустым"
                })
                .regex(
                    /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                    'Выходной должен соответствовать шаблону "YYYY-MM-DD"'
                ),
            endDate: z
                .string({
                    invalid_type_error: "Выходной должен быть строкой",
                    required_error: "Выходной не должен быть пустым"
                })
                .regex(
                    /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                    'Выходной должен соответствовать шаблону "YYYY-MM-DD"'
                )
        }),
        {
            required_error: "Каникулы отсутствуют",
            invalid_type_error: "Каникулы должны быть массивом"
        }
    )
});

export default holidaysSchema;
