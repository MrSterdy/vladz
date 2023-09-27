import type { LayoutServerLoad } from "./$types";
import { getSubjects } from "$lib/server/services/subjectService";

export const load: LayoutServerLoad = async () => {
    const subjects = await getSubjects();

    return { subjects };
};