<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";

    import type { PageData } from "./$types";

    import BackButton from "$lib/components/BackButton.svelte";
    import MainButton from "$lib/components/MainButton.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import Search from "$lib/components/Search.svelte";
    import Status from "$lib/components/Status.svelte";
    import { handleError, handleUpdated } from "$lib/utils/form";

    export let data: PageData;

    const { form, constraints, enhance } = superForm(data.amountForm, {
        onResult: () => createModal.close(),
        onUpdated: handleUpdated,
        onError: handleError,
        taintedMessage: null
    });

    let createForm: HTMLFormElement;

    let createModal: HTMLDialogElement;
    let modalOpen = false;
</script>

<BackButton newPage="../" />

<div class="flex flex-col gap-4 h-full">
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

    <dialog bind:this={createModal} class="modal" on:close={() => modalOpen = false}>
        <form bind:this={createForm} method="POST" class="modal-box" use:enhance>
            <input
                class="w-full input input-bordered input-primary"
                type="number"
                name="amount"
                placeholder="Количество"
                bind:value={$form.amount}
                {...$constraints.amount}
            />
            <MainButton
                text="ПОДТВЕРДИТЬ СОЗДАНИЕ"
                onClick={() => createForm.requestSubmit()}
            />
        </form>
        <form method="dialog" class="modal-backdrop">
            <button>Закрыть</button>
        </form>
    </dialog>

    {#if !modalOpen}
        <MainButton
            text="СОЗДАТЬ НОВЫЕ ГРУППЫ"
            onClick={() => {
                createModal.showModal();
                modalOpen = true;
            }}
        />
    {/if}
</div>
