import { z } from "zod";

const clusterSchema = z.object({
    name: z
        .string({
            invalid_type_error: "Имя кластера должно быть строкой",
            required_error: "Имя кластера не должно быть пустым"
        })
        .max(32, "Имя кластера не должно превышать 32 символов")
});

export default clusterSchema;
