import type { LayoutServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

import { getWeekdayTimetable } from "$lib/server/services/timetableService";

export const load: LayoutServerLoad = async event => {
    const weekday = parseInt(event.params.weekday);
    if (isNaN(weekday) || weekday < 0 || weekday > 6) {
        throw error(400);
    }

    const groupId = parseInt(event.params.groupId);

    const timetable = (await getWeekdayTimetable(weekday, groupId)) ?? {
        offset: 0,
        subjectBreak: 0,
        subjectLength: 0,
        subjects: [],
        note: "",
        weekday
    };

    return { timetable };
};
