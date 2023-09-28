import type { LayoutServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

import {
    getDateTimetable,
    getWeekdayTimetable
} from "$lib/server/services/timetableService";

export const load: LayoutServerLoad = async event => {
    const timestamp = Date.parse(event.params.date);
    if (isNaN(timestamp)) {
        throw error(400, { message: "Неправильный формат даты" });
    }

    const date = new Date(timestamp);

    const [dateTimetable, weekdayTimetable] = await Promise.all([
        getDateTimetable(date.toISOString(), event.locals.group!.id),
        getWeekdayTimetable(date.getDay(), event.locals.group!.id)
    ]);

    if (!dateTimetable && !weekdayTimetable) {
        throw error(400);
    }

    return { dateTimetable, weekdayTimetable };
};
