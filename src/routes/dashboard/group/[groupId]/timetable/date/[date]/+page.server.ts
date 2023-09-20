import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

import {
    getDateTimetable,
    getWeekdayTimetable
} from "$lib/server/services/timetableService";
import type { Timetable } from "$lib/types";

export const load: PageServerLoad = async event => {
    const timestamp = Date.parse(event.params.date);
    if (isNaN(timestamp)) {
        throw error(400, { message: "Неправильный формат даты" });
    }

    const groupId = parseInt(event.params.groupId);

    const date = new Date(timestamp);

    let timetable: Timetable | null = await getDateTimetable(
        date.toISOString(),
        groupId
    );

    if (!timetable) {
        timetable = await getWeekdayTimetable(date.getDay(), groupId);

        if (!timetable) {
            throw error(400, { message: "Расписание не найдено" });
        }
    }

    return { timetable };
};
