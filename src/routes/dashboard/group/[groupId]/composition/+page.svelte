<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1>Состав {data.group.name}:</h1>
{#if data.group.users.length}
    <ul>
        {#each data.group.users as user}
            <li>
                <h2>{user.lastName} {user.firstName} [{user.role}]</h2>
            </li>
        {/each}
    </ul>

    {#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR"}
        <a href="edit">Редактировать</a>
    {/if}
{:else}
    <h2>Класс пустует</h2>
{/if}