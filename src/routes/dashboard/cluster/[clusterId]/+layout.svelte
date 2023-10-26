<script lang="ts">
    import type { PageData } from "./$types";

    import { page } from "$app/stores";

    import Icon from "$lib/components/Icon.svelte";

    export let data: PageData;

    $: clusterPath = $page.url.pathname
        .split(/^\/dashboard\/cluster\/\d+/)
        .join("");
</script>

<section class="flex flex-col h-full">
    <div class="breadcrumbs pt-0">
        <ul class="m-0 p-0">
            <li class="m-0 p-0">
                <a
                    href="/dashboard/cluster/{data.groupCluster.id}"
                    class:disabled={clusterPath === "/"}
                >
                    <Icon
                        name="home"
                        class="fill-base-content icon-small mr-2"
                    />
                    {data.groupCluster.name}
                </a>
            </li>
            {#if clusterPath.startsWith("/groups")}
                <li class="m-0 p-0">
                    <a
                        href="/dashboard/cluster/{data.groupCluster.id}/groups"
                        class:disabled={clusterPath === "/groups/"}
                    >
                        <Icon
                            name="cluster"
                            class="fill-base-content icon-small mr-2"
                        />
                        Группы
                    </a>
                </li>
            {/if}
            {#if clusterPath.includes("/edit")}
                <li class="m-0 p-0">
                    <Icon
                        name="pencil"
                        class="fill-base-content icon-small mr-2"
                    />
                    Редактирование
                </li>
            {/if}
        </ul>
    </div>

    <section class="grow">
        <slot />
    </section>
</section>
