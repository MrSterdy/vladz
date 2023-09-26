import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

import {
    getDateTimetable,
    getWeekdayTimetable
} from "$lib/server/services/timetableService";
import type { Timetable } from "$lib/types";

export const load: PageServerLoad = async event => {
    const weekday = parseInt(event.params.weekday);
    if (isNaN(weekday) || weekday < 0 || weekday > 6) {
        throw error(400);
    }

    const groupId = parseInt(event.params.groupId);

    const timetable = await getWeekdayTimetable(weekday, groupId);
    if (!timetable) {
        throw error(400);
    }

    return { timetable };
};
