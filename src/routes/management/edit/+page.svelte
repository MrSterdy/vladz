<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";

    import type { PageData } from "./$types";

    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import BackButton from "$lib/components/BackButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import Status from "$lib/components/Status.svelte";
    import { userRoles } from "$lib/consts";
    import { handleError, handleUpdated } from "$lib/utils/form";
    import { capitalize } from "$lib/utils/string";

    export let data: PageData;

    let searchInput = $page.url.searchParams.get("search") ?? "";

    async function search() {
        const query = new URLSearchParams($page.url.searchParams.toString());
        query.set("page", "1");
        query.set("search", searchInput);
        goto(`?${query.toString()}`);
    }

    const { enhance } = superForm(data.form, {
        onUpdated: handleUpdated,
        onError: handleError
    });
</script>

<BackButton newPage="../" />

<h1 class="text-center">Редактирование руководства</h1>

<section class="flex flex-col gap-4">
    <input
        type="text"
        class="w-full input input-primary input-bordered"
        placeholder="Имя"
        bind:value={searchInput}
        on:change={search}
    />

    {#if $page.url.searchParams.get("search")}
        {#if data.search.items.length}
            <div class="space-y-4">
                {#each data.search.items as user}
                    <div class="card card-compact card-body bg-base-100 gap-0">
                        <div
                            class="card-title flex flex-wrap items-center gap-2"
                        >
                            <span class="word-break"
                                >{user.lastName} {user.firstName}</span
                            >
                            <span class="badge badge-accent badge-outline"
                                >{capitalize(userRoles[user.role])}</span
                            >
                        </div>

                        <div
                            class="flex flex-wrap gap-2 justify-between items-center"
                        >
                            <p class="m-0 fill-base-content">ID: {user.id}</p>

                            {#if user.role !== "ADMIN"}
                                <div class="card-actions m-0">
                                    {#if user.role === "HELPER"}
                                        <form
                                            method="post"
                                            action="?/demote"
                                            use:enhance
                                        >
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={user.id}
                                            />
                                            <button
                                                type="submit"
                                                class="btn btn-ghost p-0"
                                            >
                                                <Icon
                                                    name="demote"
                                                    class="icon-medium fill-error"
                                                />
                                            </button>
                                        </form>
                                    {:else}
                                        <form
                                            method="post"
                                            action="?/promote"
                                            use:enhance
                                        >
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={user.id}
                                            />
                                            <button
                                                type="submit"
                                                class="btn btn-ghost p-0"
                                            >
                                                <Icon
                                                    name="promote"
                                                    class="icon-medium fill-success"
                                                />
                                            </button>
                                        </form>
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>

            <Pagination
                currentPage={data.search.page}
                totalItems={data.search.total}
            />
        {:else}
            <Status icon="sad" message="Никого нет" />
        {/if}
    {:else if data.management.length}
        <table class="table">
            <thead>
                <tr>
                    <th />
                    <th>Имя</th>
                    <th>Роль</th>
                    <th />
                    <th />
                </tr>
            </thead>
            <tbody>
                {#each data.management as user, i}
                    <tr>
                        <th>{i + 1}</th>
                        <td class="word-break"
                            >{user.lastName} {user.firstName}</td
                        >
                        <td>
                            <span class="badge badge-accent badge-outline">
                                {capitalize(userRoles[user.role])}
                            </span>
                        </td>
                        {#if user.role === "HELPER"}
                            <td class="p-0">
                                <form
                                    method="post"
                                    action="?/demote"
                                    use:enhance
                                >
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={user.id}
                                    />

                                    <button
                                        type="submit"
                                        class="btn btn-ghost p-0"
                                    >
                                        <Icon
                                            name="demote"
                                            class="icon-medium fill-error"
                                        />
                                    </button>
                                </form>
                            </td>
                        {/if}
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <Status icon="sad" message="Никого нет" />
    {/if}
</section>
