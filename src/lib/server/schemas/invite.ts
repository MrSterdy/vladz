import { z } from "zod";

const inviteSchema = z.object({
    invite_code: z.string({
        required_error: "Код приглашения не должен быть пустым",
        invalid_type_error: "Код приглашения должен быть строкой"
    }).length(16, "Код приглашения должен состоять из 16 символов")
});

export default inviteSchema;
