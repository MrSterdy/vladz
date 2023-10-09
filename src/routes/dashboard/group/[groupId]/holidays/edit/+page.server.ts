import type { Actions, PageServerLoad } from "./$types";

import { fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";
import { updateHolidays } from "$lib/server/services/holidayService";
import { parseDate } from "$lib/utils/time";
import type { Holiday } from "$lib/types";
import holidaysSchema from "$lib/server/schemas/holidays";

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

        for (const [index, holiday] of form.data.holidays.entries()) {
            const startDate = parseDate(holiday.startDate);
            if (!startDate.isValid()) {
                return setError(
                    form,
                    `holidays[${index}].startDate`,
                    "Неправильный формат выходного"
                );
            }

            const endDate = parseDate(holiday.endDate);
            if (!endDate.isValid()) {
                return setError(
                    form,
                    `holidays[${index}].endDate`,
                    "Неправильный формат выходного"
                );
            }

            if (startDate.isAfter(endDate)) {
                return setError(
                    form,
                    `holidays[${index}].startDate`,
                    "Начало каникул должен быть раньше или равно началу каникул"
                );
            }

            holidays.push({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            });
        }

        await updateHolidays(event.locals.group!.id, holidays);

        throw redirect(303, "../");
    }
};
