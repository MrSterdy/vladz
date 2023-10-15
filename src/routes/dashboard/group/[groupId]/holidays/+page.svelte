<script lang="ts">
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";
    import MainButton from "$lib/components/MainButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import { capitalize } from "$lib/utils/string";
    import dayjs from "dayjs";
    import { humanize } from "$lib/utils/time";

    export let data: PageData;
</script>

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
    <div class="flex flex-col items-center">
        <Icon name="sad" class="h-24 w-24 fill-base-content" />
        <p class="text-lg text-base-content">Нет выходных</p>
    </div>
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "EDITOR"}
    <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
