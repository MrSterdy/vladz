<script lang="ts">
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { numberToTime } from "$lib/utils/time";
    import { capitalize } from "$lib/utils/string";
    import { weekdays } from "$lib/consts";
    import { goto } from "$app/navigation";
    import MainButton from "$lib/components/MainButton.svelte";

    export let data: PageData;

    let totalOffset = data.timetable.offset;
    const offsets = data.timetable.subjects.map(subject => {
        const result = [totalOffset, totalOffset + subject.length];

        totalOffset += subject.length + subject.break;

        return result;
    });
</script>

<h1>{capitalize(weekdays[parseInt($page.params["weekday"])])}</h1>
<p>Начало занятий: {numberToTime(data.timetable.offset)}</p>

{#if data.timetable.subjects.length}
    <ul>
        {#each data.timetable.subjects as subject, i}
            {#if subject.name}
                {@const offset = offsets[i]}
                <li>
                    [{numberToTime(offset[0])} - {numberToTime(offset[1])}]
                    <h2>
                        {subject.name} [{subject.classroom || "Нет кабинета"}] [{subject.teacher ||
                            "Нет учителя"}]
                    </h2>
                </li>
            {/if}
        {/each}
    </ul>
{:else}
    <h2>Нет предметов</h2>
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "REDACTOR"}
    <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
