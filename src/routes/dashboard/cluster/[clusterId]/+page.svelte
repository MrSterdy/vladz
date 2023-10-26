<script lang="ts">
    import type { PageData } from "./$types";

    import { goto } from "$app/navigation";

    import BackButton from "$lib/components/BackButton.svelte";
    import MainButton from "$lib/components/MainButton.svelte";

    export let data: PageData;
</script>

<BackButton newPage="/dashboard/clusters" />

<section class="flex flex-col justify-between h-full gap-5">
    <div class="card card-compact card-body bg-base-100 grow-0">
        <h1 class="card-title m-0">
            {data.groupCluster.name}
        </h1>
    </div>

    <div class="flex flex-wrap gap-2">
        <a role="button" href="groups" class="btn btn-primary grow basis-0"
            >Группы</a
        >

        <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
    </div>
</section>
