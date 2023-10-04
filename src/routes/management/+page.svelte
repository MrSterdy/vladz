<script lang="ts">
    import type { PageData } from "./$types";

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
                    {user.firstName} [{user.role === "ADMIN"
                        ? "Администратор"
                        : "Помощник администратора"}]
                </h2>
            </li>
        {/each}
    </ul>
{:else}
    <h2>Никого нет</h2>
{/if}

{#if data.user?.role === "ADMIN"}
    <a href="/management/edit">Редактировать</a>
{/if}
