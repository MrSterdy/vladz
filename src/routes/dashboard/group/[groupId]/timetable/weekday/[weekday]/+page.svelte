<script lang="ts">
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { capitalize, numberToTime } from "$lib/utils";
    import { weekdays } from "$lib/consts";

    export let data: PageData;

    let totalOffset = data.timetable.offset;
    const offsets = data.timetable.subjects.map(subject => {
        const result = [totalOffset, totalOffset + subject.length];

        totalOffset += subject.length + subject.break;

        return result;
    });
</script>

<h1>{capitalize(weekdays[parseInt($page.params["weekday"])])}</h1>
<p>{data.timetable.note || "Нет примечания"}</p>
<p>Начало занятий: {numberToTime(data.timetable.offset)}</p>

{#if data.timetable.subjects.length}
    <ul>
        {#each data.timetable.subjects as subject, i}
            {@const offset = offsets[i]}
            <li>
                [{numberToTime(offset[0])} - {numberToTime(offset[1])}]
                <h2>{subject.name} [{subject.classroom || "Нет кабинета"}] [{subject.teacher || "Нет учителя"}]</h2>
            </li>
        {/each}
    </ul>
{:else}
    <h2>Нет предметов</h2>
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "REDACTOR"}
    <a href="edit">Редактировать</a>
{/if}