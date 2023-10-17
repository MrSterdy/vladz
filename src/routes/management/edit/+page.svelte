<script lang="ts">
    import type { PageData } from "./$types";

    import { enhance as kitEnhance } from "$app/forms";
    import { superForm } from "sveltekit-superforms/client";
    import { capitalize } from "$lib/utils/string";
    import { groupUserRoles, userRoles } from "$lib/consts";
    import Icon from "$lib/components/Icon.svelte";
    import MainButton from "$lib/components/MainButton.svelte";
    import { handleError, handleUpdated } from "$lib/utils/form";

    export let data: PageData;

    const { form, enhance, constraints, errors } = superForm(data.form, {
        onUpdated: handleUpdated,
        onError: handleError
    });

    let promoteForm: HTMLFormElement;
</script>

<h1 class="text-center">Редактирование руководства</h1>

<form method="post" action="?/promote" use:enhance>
    <input
        type="number"
        name="id"
        class="w-full input input-primary input-bordered"
        aria-invalid={$errors.id ? true : undefined}
        placeholder="ID пользователя"
        bind:value={$form.id}
        {...$constraints.id}
    />

    <MainButton text="ПОВЫСИТЬ" onClick={() => promoteForm.requestSubmit()} />
</form>

{#if data.management.length}
    <table class="table">
        <thead>
        <tr>
            <th></th>
            <th>Имя</th>
            <th>Роль</th>
            <th></th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        {#each data.management as user, i}
            <tr>
                <th>{i + 1}</th>
                <td class="break-word">{user.lastName} {user.firstName}</td>
                <td>
                <span class="badge badge-accent badge-outline">
                    {capitalize(userRoles[user.role])}
                </span>
                </td>
                {#if user.role === "HELPER"}
                    <td class="p-0">
                        <form method="post" action="?/demote" use:kitEnhance>
                            <input type="hidden" name="id" value={user.id} />

                            <button type="submit" class="btn btn-ghost p-0">
                                <Icon name="demote" class="icon-medium fill-error" />
                            </button>
                        </form>
                    </td>
                {/if}
            </tr>
        {/each}
        </tbody>
    </table>
{:else}
    <div class="flex flex-col items-center">
        <Icon name="sad" class="h-24 w-24 fill-base-content" />
        <p class="text-lg text-base-content">Никого нет</p>
    </div>
{/if}
