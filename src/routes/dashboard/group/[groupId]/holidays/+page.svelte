<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1>Каникулы</h1>

{#if data.holidays.length}
    <ul>
        {#each data.holidays as holiday}
            <li><h2>{holiday.startDate} - {holiday.endDate}</h2></li>
        {/each}
    </ul>
{:else}
    <h2>Нет каникул :(</h2>
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "REDACTOR"}
    <a href="edit">Редактировать</a>
{/if}
