<script lang="ts">
    import type { PageData } from "./$types";
    import { userRoles } from "$lib/consts";
    import { capitalize } from "$lib/utils";
    import { goto } from "$app/navigation";
    import MainButton from "$lib/components/MainButton.svelte";

    export let data: PageData;
</script>

<h1>Руководство</h1>

<form></form>

{#if data.management.length}
    <ul>
        {#each data.management as user}
            <li>
                <h2>
                    {user.lastName}
                    {user.firstName} [{capitalize(userRoles[user.role])}]
                </h2>
            </li>
        {/each}
    </ul>
{:else}
    <h2>Никого нет</h2>
{/if}

{#if data.user?.role === "ADMIN"}
    <MainButton onClick={() => goto("/management/edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
