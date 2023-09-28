import type { LayoutServerLoad } from "./$types";
import { getHolidays } from "$lib/server/services/holidayService";

export const load: LayoutServerLoad = async event => {
    const holidays = await getHolidays(parseInt(event.params.groupId));

    return { holidays };
};