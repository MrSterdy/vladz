<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1>Предметы</h1>

{#if data.subjects.length}
    <ul>
        {#each data.subjects as subject}
            <li>
                <h2>{subject.name}</h2>
            </li>
        {/each}
    </ul>
{:else}
    <h2>Нет предметов</h2>
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "REDACTOR"}
    <a href="edit">Редактировать</a>
{/if}
