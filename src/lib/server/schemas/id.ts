import { z } from "zod";

const idSchema = z.object({
    id: z.bigint({
        required_error: "ID пользователя не должно быть пустым",
        invalid_type_error: "ID пользователя должно быть числом"
    })
});

export default idSchema;
