import type { LayoutServerLoad } from "./$types";
import { getHolidays } from "$lib/server/services/holidayService";

export const load: LayoutServerLoad = async event => {
    const holidays = await getHolidays(event.locals.group!.id);

    return { holidays };
};