import type { Actions, PageServerLoad } from "./$types";

import { z } from "zod";
import { error, fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { updateHolidays } from "$lib/server/services/holidayService";

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
    const { groupUser, holidays } = await event.parent();

    if (
        event.locals.user!.role !== "USER" ||
        (groupUser &&
            groupUser.role !== "STUDENT" &&
            groupUser.role !== "APPLICATION")
    ) {
        const form = await superValidate(updateHolidaysSchema);

        form.data.holidays = holidays;

        return { form };
    }

    throw error(403);
};

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, updateHolidaysSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        await updateHolidays(
            parseInt(event.params.groupId),
            form.data.holidays.map(holiday => ({
                startDate: new Date(holiday.startDate).toISOString(),
                endDate: new Date(holiday.endDate).toISOString()
            }))
        );

        throw redirect(303, "../");
    }
};
