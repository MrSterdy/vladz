import type { Actions, PageServerLoad } from "./$types";

import { z } from "zod";
import { fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/server";
import { updateHolidays } from "$lib/server/services/holidayService";
import dayjs from "dayjs";

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

        for (const holiday of form.data.holidays) {
            const startDate = dayjs(holiday.startDate);
            const endDate = dayjs(holiday.endDate);

            if (startDate.isAfter(endDate)) {
                return message(form, "Конец каникул должен быть позже или равен началу каникул");
            }
        }

        await updateHolidays(
            event.locals.group!.id,
            form.data.holidays.map(holiday => ({
                startDate: new Date(holiday.startDate).toISOString(),
                endDate: new Date(holiday.endDate).toISOString()
            }))
        );

        throw redirect(303, "../");
    }
};
