import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import { updateWeekdayTimetable } from "$lib/server/services/timetableService";

const timetableSchema = z.object({
    offset: z.number().min(0).max(1440),
    subjectLength: z.number().min(0).max(1024),
    subjectBreak: z.number().min(0).max(1024),
    note: z.string().max(1024).nullish(),
    subjects: z.array(z.object({
        name: z.string().max(64),
        length: z.number().min(0).max(1024),
        break: z.number().min(0).max(1024),
        teacher: z.string().max(128).nullish(),
        classroom: z.string().max(64).nullish(),
        position: z.number().max(64)
    })).max(64)
});

export const load: PageServerLoad = async event => {
    const { groupUser, timetable } = await event.parent();

    if (
        event.locals.user!.role !== "USER" ||
        (groupUser &&
            groupUser.role !== "STUDENT" &&
            groupUser.role !== "APPLICATION")
    ) {
        const form = await superValidate(timetableSchema);

        form.data = timetable;

        return { form };
    }

    throw error(403);
};

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, timetableSchema);
        if (!form.valid) {
            return fail(400, { form });
        }

        const groupId = parseInt(event.params.groupId);
        const weekday = parseInt(event.params.weekday);

        await updateWeekdayTimetable(groupId, {
            weekday,
            note: form.data.note ?? null,
            offset: form.data.offset,
            subjectBreak: form.data.subjectBreak,
            subjectLength: form.data.subjectLength,
            subjects: form.data.subjects.map(subject => ({
                name: subject.name,
                length: subject.length,
                break: subject.break,
                teacher: subject.teacher ?? null,
                classroom: subject.classroom ?? null,
                position: subject.position
            }))
        });

        throw redirect(303, "../");
    }
}
