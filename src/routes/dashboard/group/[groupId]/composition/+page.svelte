<script lang="ts">
    import type { PageData } from "./$types";
    import { capitalize } from "$lib/utils";
    import { groupUserRoles } from "$lib/consts";

    export let data: PageData;
</script>

<h1>Состав {data.group.name}:</h1>
{#if data.group.users.length}
    <ul>
        {#each data.group.users as user}
            <li>
                <h2>{user.lastName} {user.firstName} [{capitalize(groupUserRoles[user.role])}]</h2>
            </li>
        {/each}
    </ul>

    {#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR"}
        <a href="edit">Редактировать</a>
    {/if}
{:else}
    <h2>Класс пустует</h2>
{/if}