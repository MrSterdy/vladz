<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";

    export let data: PageData;

    const { form, errors, constraints, enhance, message } = superForm(data.inviteForm);
</script>

<form method="POST" use:enhance>
    <input
        type="text"
        aria-invalid={$errors.invite_code ? "true" : undefined}
        name="invite_code"
        placeholder="Код группы"
        bind:value={$form.invite_code}
        {...$constraints.invite_code}
    />
    {#if $message}<span>{$message}</span>{/if}
    <input type="submit" />
</form>

{#if data.groups.length}
    <ul>
        {#each data.groups as group}
            <li><a href="/dashboard/group/{group.id}">{group.name}</a></li>
        {/each}
    </ul>
{:else}
    <h1>Нет групп</h1>
{/if}
