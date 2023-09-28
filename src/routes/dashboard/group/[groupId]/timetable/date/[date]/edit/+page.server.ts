import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import { updateDateTimetable } from "$lib/server/services/timetableService";

const timetableSchema = z.object({
    offset: z.number().min(0).max(1440),
    note: z.string().max(1024).nullable(),
    subjects: z
        .array(
            z.object({
                name: z.string().max(64),
                length: z.number().min(0).max(1024),
                break: z.number().min(0).max(1024),
                teacher: z.string().max(128).nullable(),
                classroom: z.string().max(64).nullable(),
                position: z.number().max(64),
                homework: z.string().nullable()
            })
        )
        .max(64)
});

export const load: PageServerLoad = async event => {
    const { dateTimetable, weekdayTimetable } = await event.parent();

    const form = await superValidate(timetableSchema);

    form.data = dateTimetable ?? {
        ...weekdayTimetable!,
        subjects: weekdayTimetable!.subjects.map(subject => ({
            ...subject,
            homework:
                "homework" in subject ? (subject.homework as string) : null
        }))
    };

    return { form };
};

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, timetableSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const date = new Date(event.params.date).toISOString();

        await updateDateTimetable(event.locals.group!.id, { date, ...form.data });

        throw redirect(303, "../");
    }
};
