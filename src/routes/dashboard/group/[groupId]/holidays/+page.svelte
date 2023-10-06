<script lang="ts">
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";
    import MainButton from "$lib/components/MainButton.svelte";

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
    <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
