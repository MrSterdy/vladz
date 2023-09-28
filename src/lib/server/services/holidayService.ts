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

export async function updateHolidays(groupId: number, holidays: Holiday[]) {
    const deleteOperation = prisma.holiday.deleteMany({ where: { groupId } });
    const createOperation = prisma.holiday.createMany({
        data: holidays.map(holiday => ({ ...holiday, groupId }))
    });

    await prisma.$transaction([deleteOperation, createOperation]);
}
