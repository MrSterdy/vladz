<script lang="ts">
    import type { PageData } from "./$types";

    import { enhance as kitEnhance } from "$app/forms";
    import { superForm } from "sveltekit-superforms/client";

    export let data: PageData;

    const { form, enhance, constraints } = superForm(data.form);
</script>

<h1>Редактирование руководства</h1>

<form method="post" action="?/promote" use:enhance>
    <input
        type="number"
        name="id"
        placeholder="ID пользователя"
        bind:value={$form.id}
        {...$constraints.id}
    />

    <input type="submit" value="Повысить" />
</form>

{#if data.management.length}
    <ul>
        {#each data.management as user}
            <li>
                <h2>
                    {user.lastName}
                    {user.firstName} [{user.role === "ADMIN"
                        ? "Администратор"
                        : "Помощник администратора"}]
                </h2>

                {#if user.role === "HELPER"}
                    <form method="post" action="?/demote" use:kitEnhance>
                        <input type="hidden" name="id" value={user.id} />

                        <input type="submit" value="Понизить" />
                    </form>
                {/if}
            </li>
        {/each}
    </ul>
{:else}
    <h2>Никого нет</h2>
{/if}
