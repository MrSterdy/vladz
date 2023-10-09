import prisma from "$lib/server/db/prisma";
import type { Holiday } from "$lib/types";
import { formatISOString } from "$lib/utils/time";

export async function getHolidays(groupId: number) {
    const result = await prisma.holiday.findMany({ where: { groupId } });

    return result.map(
        holiday =>
            ({
                startDate: formatISOString(holiday.startDate),
                endDate: formatISOString(holiday.endDate)
            } satisfies Holiday)
    );
}

export async function updateHolidays(groupId: number, holidays: Holiday[]) {
    const deleteOperation = prisma.holiday.deleteMany({ where: { groupId } });
    const createOperation = prisma.holiday.createMany({
        data: holidays.map(holiday => ({
            startDate: holiday.startDate,
            endDate: holiday.endDate,
            groupId
        }))
    });

    await prisma.$transaction([deleteOperation, createOperation]);
}
