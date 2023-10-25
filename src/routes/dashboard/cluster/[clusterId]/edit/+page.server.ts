import { fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms/server";

import type { PageServerLoad, Actions } from "./$types";

import clusterSchema from "$lib/server/schemas/cluster";
import {
    deleteCluster,
    updateClusterName
} from "$lib/server/services/clusterService";

export const load: PageServerLoad = async event => {
    const form = await superValidate(clusterSchema);

    form.data.name = event.locals.groupCluster!.name;

    return { form };
};

export const actions: Actions = {
    delete: async event => {
        const cluster = event.locals.groupCluster!;

        await deleteCluster(cluster.id);

        throw redirect(
            "/dashboard/clusters",
            { type: "success", message: "Кластер был удален" },
            event
        );
    },
    update: async event => {
        const form = await superValidate(event.request, clusterSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        await updateClusterName(event.locals.groupCluster!.id, form.data.name);

        throw redirect(
            "../",
            {
                type: "success",
                message: "Информация о кластере была обновлена"
            },
            event
        );
    }
};
