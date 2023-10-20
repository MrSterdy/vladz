<script lang="ts">
    import type { PageData } from "./$types";

    import { goto } from "$app/navigation";

    import BackButton from "$lib/components/BackButton.svelte";
    import MainButton from "$lib/components/MainButton.svelte";
    import { userRoles } from "$lib/consts";
    import { capitalize } from "$lib/utils/string";

    export let data: PageData;
</script>

<BackButton newPage="/" />

<section>
    <h1 class="text-center">Аккаунт</h1>

    <div class="card card-compact card-body bg-base-100">
        <h2 class="card-title m-0">
            {data.user.lastName}
            {data.user.firstName}
            <span class="badge badge-accent badge-outline">
                {capitalize(userRoles[data.user.role])}
            </span>
        </h2>
        <p class="m-0">ID: <span>{data.user.id}</span></p>
    </div>

    <MainButton
        onClick={() => goto("/dashboard/account/settings")}
        text="НАСТРОЙКИ"
    />
</section>
