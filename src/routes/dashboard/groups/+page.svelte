<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";

    import type { PageData } from "./$types";

    import { enhance as kitEnhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import Icon from "$lib/components/Icon.svelte";
    import MainButton from "$lib/components/MainButton.svelte";
    import { pageSize } from "$lib/consts";
    import { handleError, handleUpdated } from "$lib/utils/form";

    export let data: PageData;

    const { form, errors, constraints, enhance } = superForm(data.inviteForm, {
        onUpdated: handleUpdated,
        onError: handleError
    });

    let inviteForm: HTMLFormElement;
    let createForm: HTMLFormElement;

    $: currentType = $page.url.searchParams.get("type");
    $: if (currentType !== "applications" && currentType !== "groups") {
        currentType = "groups";
    }

    const totalPages = Math.floor(data.groups.total / pageSize);

    function prevPage() {
        const query = new URLSearchParams($page.url.searchParams.toString());
        query.set(
            "page",
            (
                (parseInt($page.url.searchParams.get("page") || "2") || 2) - 1
            ).toString()
        );
        goto(`?${query.toString()}`);
    }

    function nextPage() {
        const query = new URLSearchParams($page.url.searchParams.toString());
        query.set(
            "page",
            (
                (parseInt($page.url.searchParams.get("page") || "1") || 1) + 1
            ).toString()
        );
        goto(`?${query.toString()}`);
    }

    function switchType(newType: "applications" | "groups") {
        if (newType === currentType) {
            return;
        }

        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("type", newType);

        goto(`?${params.toString()}`);
    }
</script>

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
    {/if}

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

            {#if totalPages > 1}
                <div class="join self-center">
                    {#if data.groups.page > 1}
                        <button
                            class="join-item btn text-lg"
                            on:click={prevPage}>«</button
                        >
                    {/if}
                    <button class="join-item btn text-lg"
                        >{data.groups.page}</button
                    >
                    {#if totalPages > data.groups.page}
                        <button
                            class="join-item btn text-lg"
                            on:click={nextPage}>»</button
                        >
                    {/if}
                </div>
            {/if}
        </div>
    {:else}
        <div class="self-center flex flex-col items-center">
            <Icon name="sad" class="h-24 w-24 fill-base-content" />
            <p class="text-lg text-base-content">Ничего нет</p>
        </div>
    {/if}

    {#if $form.invite_code.length === 16}
        <MainButton
            text="ПОДАТЬ ЗАЯВКУ"
            onClick={() => inviteForm.requestSubmit()}
        />
    {:else if data.user.role === "ADMIN" || data.user.role === "HELPER"}
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
</div>
