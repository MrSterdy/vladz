import prisma from "$lib/server/db/prisma";
import type { Holiday } from "$lib/types";

export async function getHolidays(groupId: number) {
    const result = await prisma.holiday.findMany({ where: { groupId } });

    return result.map(
        holiday =>
            ({
                startDate: holiday.startDate.toISOString().split("T")[0],
                endDate: holiday.endDate.toISOString().split("T")[0]
            } satisfies Holiday)
    );
}
