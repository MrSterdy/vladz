<script lang="ts">
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import dayjs from "dayjs";
    import { capitalize, numberToTime } from "$lib/utils";

    export let data: PageData;

    let totalOffset =
        data.dateTimetable?.offset ?? data.weekdayTimetable?.offset ?? 0;
    const offsets = (
        data.dateTimetable?.subjects ??
        data.weekdayTimetable?.subjects ??
        []
    ).map(subject => {
        const result = [totalOffset, totalOffset + subject.length];

        totalOffset += subject.length + subject.break;

        return result;
    });
</script>

{#if data.dayOff}
    <h1>Выходной</h1>
{:else}
    <h1>{capitalize(dayjs($page.params["date"]).format("MMMM D, YYYY"))}</h1>
    <p>
        {data.dateTimetable?.note ||
            data.weekdayTimetable?.note ||
            "Нет примечания"}
    </p>
    <p>
        Начало занятий: {numberToTime(
            data.dateTimetable?.offset || data.weekdayTimetable?.offset || 0
        )}
    </p>

    {#if data.dateTimetable?.subjects.length || data.weekdayTimetable?.subjects.length}
        <ul>
            {#each data.dateTimetable?.subjects ?? data.weekdayTimetable?.subjects ?? [] as subject, i}
                {#if subject.name}
                    {@const offset = offsets[i]}
                    <li>
                        [{numberToTime(offset[0])} - {numberToTime(offset[1])}]
                        {subject.name} [{subject.classroom || "Нет кабинета"}] [{subject.teacher ||
                            "Нет учителя"}]
                        {#if "homework" in subject && subject.homework}
                            <p>{subject.homework}</p>
                        {/if}
                    </li>
                {/if}
            {/each}
        </ul>
    {:else}
        <h2>Нет предметов</h2>
    {/if}
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "REDACTOR"}
    <a href="edit">Редактировать</a>
{/if}
