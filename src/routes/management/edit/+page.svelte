<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";

    import type { PageData } from "./$types";

    import { enhance as kitEnhance } from "$app/forms";

    import BackButton from "$lib/components/BackButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import MainButton from "$lib/components/MainButton.svelte";
    import Status from "$lib/components/Status.svelte";
    import { userRoles } from "$lib/consts";
    import { handleError, handleUpdated } from "$lib/utils/form";
    import { capitalize } from "$lib/utils/string";

    export let data: PageData;

    const { form, enhance, constraints, errors } = superForm(data.form, {
        onUpdated: handleUpdated,
        onError: handleError
    });

    let promoteForm: HTMLFormElement;
</script>

<BackButton newPage="../" />

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
                    <td class="word-break">{user.lastName} {user.firstName}</td>
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
                                use:kitEnhance
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    value={user.id}
                                />

                                <button type="submit" class="btn btn-ghost p-0">
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
