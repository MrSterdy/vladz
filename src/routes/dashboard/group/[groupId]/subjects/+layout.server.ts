import type { LayoutServerLoad } from "./$types";
import { getSubjects } from "$lib/server/services/subjectService";

export const load: LayoutServerLoad = async event => {
    const subjects = await getSubjects(event.locals.group!.id);

    return { subjects };
};