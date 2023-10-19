<script lang="ts">
    import dayjs from "dayjs";

    import type { PageData } from "./$types";

    import { goto } from "$app/navigation";

    import MainButton from "$lib/components/MainButton.svelte";
    import Status from "$lib/components/Status.svelte";
    import { capitalize } from "$lib/utils/string";
    import { humanize } from "$lib/utils/time";
    import BackButton from "$lib/components/BackButton.svelte";

    export let data: PageData;
</script>

<BackButton newPage="../" />

{#if data.holidays.length}
    <ul>
        {#each data.holidays as holiday}
            <li>
                <p>
                    {capitalize(humanize(dayjs(holiday.startDate)))}
                    {#if holiday.startDate !== holiday.endDate}
                        по {humanize(dayjs(holiday.endDate))}
                    {/if}
                </p>
            </li>
        {/each}
    </ul>
{:else}
    <Status icon="sad" message="Нет выходных" />
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "EDITOR"}
    <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
