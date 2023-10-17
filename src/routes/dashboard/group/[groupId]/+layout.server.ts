import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = event => {
    const { group, groupUser } = event.locals;

    return { group: group!, groupUser: groupUser };
};
