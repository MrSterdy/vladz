import type { LayoutServerLoad } from "./$types";
import { getSubjects } from "$lib/server/services/subjectService";

export const load: LayoutServerLoad = async event => {
    const subjects = await getSubjects(parseInt(event.params.groupId));

    return { subjects };
};