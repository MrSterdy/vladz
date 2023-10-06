<script lang="ts">
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";
    import MainButton from "$lib/components/MainButton.svelte";

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
    <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
