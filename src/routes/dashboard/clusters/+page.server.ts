import { error } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";

import type { PageServerLoad, Actions } from "./$types";

import {
    createCluster,
    getClusters,
    getUserClusters
} from "$lib/server/services/clusterService";

export const load: PageServerLoad = async event => {
    const getAll = event.locals.user!.role !== "USER";

    const search = event.url.searchParams.get("search") ?? "";
    const page = parseInt(event.url.searchParams.get("page") || "1") || 1;

    const clusters = getAll
        ? await getClusters(page, search)
        : await getUserClusters(event.locals.user!.id, page, search);

    return { clusters };
};

export const actions: Actions = {
    default: async event => {
        if (event.locals.user!.role === "USER") {
            throw error(403);
        }

        await createCluster("Новый кластер", event.locals.user!.id);

        setFlash(
            { type: "success", message: "Новый кластер был успешно создан" },
            event
        );
    }
};
