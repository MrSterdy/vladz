import { error } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

import { getHolidays } from "$lib/server/services/holidayService";
import {
    getDateTimetable,
    getWeekdayTimetable
} from "$lib/server/services/timetableService";
import { parseDate } from "$lib/utils/time";

export const load: LayoutServerLoad = async event => {
    const date = parseDate(event.params.date);
    if (!date.isValid()) {
        throw error(400, { message: "Неправильный формат даты" });
    }

    const [holidays, dateTimetable, weekdayTimetable] = await Promise.all([
        getHolidays(event.locals.group!.id),
        getDateTimetable(date.toISOString(), event.locals.group!.id),
        getWeekdayTimetable(date.day(), event.locals.group!.id)
    ]);

    const dayOff =
        (holidays.some(holiday => {
            const startDate = parseDate(holiday.startDate);
            const endDate = parseDate(holiday.endDate);

            return (
                (date.isAfter(startDate) && date.isBefore(endDate)) ||
                date.isSame(startDate) ||
                date.isSame(endDate)
            );
        }) &&
            !dateTimetable?.subjects.filter(s => s.name).length) ||
        (!dateTimetable?.subjects.filter(s => s.name).length &&
            !weekdayTimetable?.subjects.filter(s => s.name).length);

    return { dayOff, dateTimetable, weekdayTimetable };
};