import type { Actions, PageServerLoad } from "./$types";

import { z } from "zod";
import { fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";
import { updateHolidays } from "$lib/server/services/holidayService";
import { parseDate } from "$lib/utils";
import type { Holiday } from "$lib/types";

const updateHolidaysSchema = z.object({
    holidays: z.array(
        z.object({
            startDate: z
                .string()
                .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/),
            endDate: z
                .string()
                .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
        })
    )
});

export const load: PageServerLoad = async event => {
    const { holidays } = await event.parent();

    const form = await superValidate(updateHolidaysSchema);

    form.data.holidays = holidays;

    return { form };
};

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, updateHolidaysSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const holidays: Holiday[] = [];

        for (const [index, holiday] of form.data.holidays.entries()) {
            const startDate = parseDate(holiday.startDate);
            if (!startDate.isValid()) {
                return setError(form, `holidays[${index}].startDate`);
            }

            const endDate = parseDate(holiday.endDate);
            if (!endDate.isValid()) {
                return setError(form, `holidays[${index}].endDate`);
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
