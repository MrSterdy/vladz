import { error, fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms/server";

import type { Actions, PageServerLoad } from "./$types";

import holidaysSchema from "$lib/server/schemas/holidays";
import { updateHolidays } from "$lib/server/services/holidayService";
import type { Holiday } from "$lib/types";
import { parseDate } from "$lib/utils/time";

export const load: PageServerLoad = async event => {
    const { holidays } = await event.parent();

    const form = await superValidate(holidaysSchema);

    form.data.holidays = holidays;

    return { form };
};

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, holidaysSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const holidays: Holiday[] = [];

        for (const holiday of form.data.holidays) {
            const startDate = parseDate(holiday.startDate);
            if (!startDate.isValid()) {
                throw error(400, { message: "Неправильный формат выходных" });
            }

            const endDate = parseDate(holiday.endDate);
            if (!endDate.isValid()) {
                throw error(400, { message: "Неправильный формат выходных" });
            }

            if (startDate.isAfter(endDate)) {
                throw error(400, { message: "Неправильный формат выходных" });
            }

            const startDateISO = startDate.toISOString();
            const endDateISO = endDate.toISOString();

            for (const oldHoliday of holidays) {
                if (
                    oldHoliday.startDate === startDateISO &&
                    oldHoliday.endDate === endDateISO
                ) {
                    throw error(400, {
                        message: "Выходные должны быть уникальными"
                    });
                }
            }

            holidays.push({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            });
        }

        await updateHolidays(event.locals.group!.id, holidays);

        throw redirect(
            "../",
            { type: "success", message: "Выходные были обновлены" },
            event
        );
    }
};
