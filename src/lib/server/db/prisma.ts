import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: import.meta.env.DEV ? ["query", "info", "warn", "error"] : ["error"]
});

export default prisma;
