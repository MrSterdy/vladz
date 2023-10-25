<script lang="ts">
    import type { PageData } from "./$types";

    import { enhance } from "$app/forms";

    import BackButton from "$lib/components/BackButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import MainButton from "$lib/components/MainButton.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import Status from "$lib/components/Status.svelte";

    export let data: PageData;

    let createForm: HTMLFormElement;
</script>

<BackButton newPage="/" />

<div class="flex flex-col gap-4 h-full">
    <form class="flex gap-2">
        <input
            type="text"
            name="search"
            class="w-full input input-primary input-bordered"
            placeholder="Имя"
        />

        <button type="submit" class="btn btn-primary">
            <Icon name="search" class="fill-primary-content icon-medium" />
        </button>
    </form>

    {#if data.clusters.items.length}
        <div class="flex flex-col gap-4">
            <ul class="list-none m-0 p-0 flex flex-col gap-4">
                {#each data.clusters.items as cluster}
                    <li class="m-0 p-0">
                        <a
                            class="no-underline"
                            href="/dashboard/cluster/{cluster.id}"
                        >
                            <div
                                class="card card-compact card-body bg-base-100"
                            >
                                <h2
                                    class="card-title m-0 flex gap-2 items-center"
                                >
                                    {cluster.name}
                                </h2>
                            </div>
                        </a>
                    </li>
                {/each}
            </ul>

            <Pagination
                currentPage={data.clusters.page}
                totalItems={data.clusters.total}
            />
        </div>
    {:else}
        <Status icon="sad" message="Нет кластеров" />
    {/if}

    {#if data.user.role !== "USER"}
        <form bind:this={createForm} method="POST" use:enhance />
        <MainButton
            text="СОЗДАТЬ НОВЫЙ КЛАСТЕР"
            onClick={() => createForm.requestSubmit()}
        />
    {/if}
</div>
