import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = event => {
    const { groupCluster } = event.locals;

    return { groupCluster: groupCluster! };
};
