<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";

    import type { PageData } from "./$types";

    import { enhance as kitEnhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import BackButton from "$lib/components/BackButton.svelte";
    import MainButton from "$lib/components/MainButton.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import Search from "$lib/components/Search.svelte";
    import Status from "$lib/components/Status.svelte";
    import { handleError, handleUpdated } from "$lib/utils/form";

    export let data: PageData;

    const { form, errors, constraints, enhance } = superForm(data.inviteForm, {
        onUpdated: handleUpdated,
        onError: handleError,
        taintedMessage: null
    });

    let inviteForm: HTMLFormElement;
    let createForm: HTMLFormElement;

    $: currentType = $page.url.searchParams.get("type");
    $: if (currentType !== "applications" && currentType !== "groups") {
        currentType = "groups";
    }

    function switchType(newType: "applications" | "groups") {
        if (newType === currentType) {
            return;
        }

        const params = new URLSearchParams();
        params.set("type", newType);

        goto(`?${params.toString()}`);
    }
</script>

<BackButton newPage="/" />

<div class="flex flex-col gap-4 h-full">
    <div class="tabs w-full flex gap-3 justify-around">
        <button
            class="tab tab-bordered"
            on:click={() => switchType("groups")}
            class:tab-active={currentType === "groups"}
        >
            Группы
        </button>
        <button
            class="tab tab-bordered"
            on:click={() => switchType("applications")}
            class:tab-active={currentType === "applications"}
        >
            Заявки
        </button>
    </div>

    {#if currentType === "applications"}
        <form bind:this={inviteForm} method="POST" action="?/join" use:enhance>
            <input
                type="text"
                aria-invalid={$errors.invite_code ? "true" : undefined}
                name="invite_code"
                placeholder="Код группы"
                class="w-full input input-bordered input-primary"
                bind:value={$form.invite_code}
                {...$constraints.invite_code}
            />
        </form>

        {#if data.groups.items.length}
            <div class="flex flex-col gap-4">
                <ul class="list-none m-0 p-0 flex flex-col gap-4">
                    {#each data.groups.items as group}
                        <li class="m-0 p-0">
                            <div
                                class="card card-compact card-body bg-base-100"
                            >
                                <h2
                                    class="card-title m-0 flex gap-2 items-center"
                                >
                                    {group.name}
                                </h2>
                            </div>
                        </li>
                    {/each}
                </ul>

                <Pagination
                    currentPage={data.groups.page}
                    totalItems={data.groups.total}
                />
            </div>
        {:else}
            <Status icon="sad" message="Нет заявок" />
        {/if}

        {#if $form.invite_code.length === 16}
            <MainButton
                text="ПОДАТЬ ЗАЯВКУ"
                onClick={() => inviteForm.requestSubmit()}
            />
        {/if}
    {:else}
        <Search />

        {#if data.groups.items.length}
            <div class="flex flex-col gap-4">
                <ul class="list-none m-0 p-0 flex flex-col gap-4">
                    {#each data.groups.items as group}
                        <li class="m-0 p-0">
                            <a
                                class="no-underline"
                                href="/dashboard/group/{group.id}"
                            >
                                <div
                                    class="card card-compact card-body bg-base-100"
                                >
                                    <h2
                                        class="card-title m-0 flex gap-2 items-center"
                                    >
                                        {group.name}
                                    </h2>
                                </div>
                            </a>
                        </li>
                    {/each}
                </ul>

                <Pagination
                    currentPage={data.groups.page}
                    totalItems={data.groups.total}
                />
            </div>
        {:else}
            <Status icon="sad" message="Нет групп" />
        {/if}

        {#if data.user.role === "ADMIN" || data.user.role === "HELPER"}
            <form
                bind:this={createForm}
                method="POST"
                action="?/create"
                use:kitEnhance
            />
            <MainButton
                text="СОЗДАТЬ НОВУЮ ГРУППУ"
                onClick={() => createForm.requestSubmit()}
            />
        {/if}
    {/if}
</div>
