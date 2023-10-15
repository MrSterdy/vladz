<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import { enhance as kitEnhance } from "$app/forms";
    import MainButton from "$lib/components/MainButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import { handleError, handleKit, handleUpdated } from "$lib/utils/form";

    export let data: PageData;

    const { form, errors, constraints, enhance } = superForm(data.inviteForm, {
        onUpdated: handleUpdated,
        onError: handleError
    });

    let inviteForm: HTMLFormElement;
    let createForm: HTMLFormElement;
</script>

<div class="flex flex-col gap-4 h-full">
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

    {#if data.groups.length || data.applications.length}
        <ul class="list-none m-0 p-0 flex flex-col gap-4">
            {#each data.groups as group}
                <li class="m-0 p-0">
                    <a class="no-underline" href="/dashboard/group/{group.id}">
                        <div class="card card-compact card-body bg-base-100">
                            <h2 class="card-title m-0 flex gap-2 items-center">
                                {group.name}
                            </h2>

                            <p class="flex gap-2 items-center m-0">
                                <Icon
                                    name="users"
                                    class="h-6 fill-base-content"
                                />
                                {group.users.length}
                            </p>
                        </div>
                    </a>
                </li>
            {/each}
            {#if data.user.role === "USER"}
                {#each data.applications as application}
                    <li class="m-0 p-0">
                        <div class="card card-compact card-body bg-base-100">
                            <h2 class="card-title m-0 flex gap-2 items-center">
                                {application.name}
                                <span
                                    class="mt-1 badge badge-accent badge-outline"
                                >ЗАЯВКА</span
                                >
                            </h2>
                        </div>
                    </li>
                {/each}
            {/if}
        </ul>
    {:else}
        <div class="self-center flex flex-col items-center">
            <Icon name="sad" class="h-24 w-24 fill-base-content" />
            <p class="text-lg text-base-content">
                Нет групп
            </p>
        </div>
    {/if}

    {#if $form.invite_code.length === 16}
        <MainButton text="ПОДАТЬ ЗАЯВКУ" onClick={() => inviteForm.requestSubmit()} />
    {:else if data.user.role === "ADMIN" || data.user.role === "HELPER"}
        <form
            bind:this={createForm}
            method="POST"
            action="?/create"
            use:kitEnhance={() => handleKit("Новая группа была успешно создана")}
        />
        <MainButton text="СОЗДАТЬ НОВУЮ ГРУППУ" onClick={() => createForm.requestSubmit()} />
    {/if}
</div>
