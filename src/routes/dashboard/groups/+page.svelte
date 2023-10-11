<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import { enhance as kitEnhance } from "$app/forms";
    import MainButton from "$lib/components/MainButton.svelte";

    export let data: PageData;

    const { form, errors, constraints, message } = superForm(data.inviteForm);

    let inviteForm: HTMLFormElement;
    const submitInviteForm = () => inviteForm.requestSubmit();

    let createForm: HTMLFormElement;
    const submitCreateForm = () => createForm.requestSubmit();
</script>

<div class="flex flex-col gap-4 h-full">
    <form bind:this={inviteForm} method="POST" action="?/join">
        <input
            type="text"
            aria-invalid={$errors.invite_code ? "true" : undefined}
            name="invite_code"
            placeholder="Код группы"
            class="w-full input input-bordered input-primary"
            bind:value={$form.invite_code}
            {...$constraints.invite_code}
        />
        {#if $message}<span>{$message}</span>{/if}
    </form>

    {#if data.groups.length}
        <ul class="list-none flex flex-col gap-4">
            {#each data.groups as group}
                {@const groupUser = group.users.find(
                    u => u.id === data.user.id
                )}
                <li>
                    <a class="no-underline" href="/dashboard/group/{group.id}">
                        <div class="card p-3 bg-base-100">
                            <h2 class="m-0 flex gap-2 items-center">
                                {group.name}
                                {#if groupUser?.role === "APPLICATION"}
                                    <span
                                        class="mt-1 badge badge-accent badge-outline"
                                        >ЗАЯВКА</span
                                    >
                                {/if}
                            </h2>

                            <p class="flex gap-2 items-center m-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    id="Layer_1"
                                    data-name="Layer 1"
                                    viewBox="0 0 24 24"
                                    width="512"
                                    height="512"
                                    class="w-auto h-6"
                                    ><path
                                        d="M12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,12,10Zm6,13A6,6,0,0,0,6,23a1,1,0,0,0,2,0,4,4,0,0,1,8,0,1,1,0,0,0,2,0ZM18,8a4,4,0,1,1,4-4A4,4,0,0,1,18,8Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,18,2Zm6,13a6.006,6.006,0,0,0-6-6,1,1,0,0,0,0,2,4,4,0,0,1,4,4,1,1,0,0,0,2,0ZM6,8a4,4,0,1,1,4-4A4,4,0,0,1,6,8ZM6,2A2,2,0,1,0,8,4,2,2,0,0,0,6,2ZM2,15a4,4,0,0,1,4-4A1,1,0,0,0,6,9a6.006,6.006,0,0,0-6,6,1,1,0,0,0,2,0Z"
                                    /></svg
                                >
                                {group.users.length}
                            </p>
                        </div>
                    </a>
                </li>
            {/each}
        </ul>
    {:else}
        <div class="self-center flex flex-col items-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                data-name="Layer 1"
                viewBox="0 0 24 24"
                width="512"
                height="512"
                class="w-24 h-24 fill-base-content"
                ><path
                    d="M10,9.5a1.5,1.5,0,0,1-3,0A1.5,1.5,0,0,1,10,9.5ZM15.5,8a1.5,1.5,0,0,0,0,3A1.5,1.5,0,0,0,15.5,8ZM24,12A12.013,12.013,0,0,0,12,0C-3.9.6-3.893,23.4,12,24A12.013,12.013,0,0,0,24,12Zm-2,0A10.011,10.011,0,0,1,12,22C-1.249,21.5-1.244,2.5,12,2A10.011,10.011,0,0,1,22,12Zm-4.254,5.666a1,1,0,0,0-.08-1.412A9.454,9.454,0,0,0,12,14a1,1,0,0,0,0,2,7.519,7.519,0,0,1,4.336,1.747,1,1,0,0,0,1.41-.081ZM5,16a2,2,0,0,0,4,0,6.571,6.571,0,0,0-1.538-3.388C6.46,11.512,4.953,15.152,5,16Z"
                /></svg
            >

            <p class="text-lg text-base-content">Нет групп, в которых вы состоите</p>
        </div>
    {/if}

    {#if $form.invite_code.length === 16}
        <MainButton text="ПОДАТЬ ЗАЯВКУ" onClick={submitInviteForm} />
    {:else if data.user.role === "ADMIN" || data.user.role === "HELPER"}
        <form
            bind:this={createForm}
            method="POST"
            action="?/create"
            use:kitEnhance
        />
        <MainButton text="СОЗДАТЬ НОВУЮ ГРУППУ" onClick={submitCreateForm} />
    {/if}
</div>
