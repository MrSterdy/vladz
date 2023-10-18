import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";

import type { Actions, PageServerLoad } from "./$types";

import { weekdayTimetableSchema } from "$lib/server/schemas/timetable";
import { getSubjects } from "$lib/server/services/subjectService";
import { updateWeekdayTimetable } from "$lib/server/services/timetableService";

export const load: PageServerLoad = async event => {
    const { timetable } = await event.parent();

    const form = await superValidate(weekdayTimetableSchema);

    const subjects = await getSubjects(event.locals.group!.id);

    form.data = timetable;

    return { form, subjects };
};

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, weekdayTimetableSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const weekday = parseInt(event.params.weekday);

        await updateWeekdayTimetable(event.locals.group!.id, {
            weekday,
            offset: form.data.offset,
            subjectBreak: form.data.subjectBreak,
            subjectLength: form.data.subjectLength,
            subjects: form.data.subjects.map(subject => ({
                name: subject.name ?? "",
                length: subject.length,
                break: subject.break,
                teacher: subject.teacher ?? null,
                classroom: subject.classroom ?? null,
                position: subject.position
            }))
        });

        throw redirect(303, "../");
    }
};
