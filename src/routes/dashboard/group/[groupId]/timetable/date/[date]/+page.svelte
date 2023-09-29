<script lang="ts">
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import dayjs from "dayjs";
    import { capitalize } from "$lib/utils";

    export let data: PageData;
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
        Начало занятий: спустя {data.dateTimetable?.offset ||
            data.weekdayTimetable?.offset} минут после полуночи
    </p>

    {#if data.dateTimetable?.subjects.length || data.weekdayTimetable?.subjects.length}
        <ul>
            {#each data.dateTimetable?.subjects ?? data.weekdayTimetable?.subjects ?? [] as subject}
                <li>
                    {subject.name} [{subject.classroom || "Нет кабинета"}] [{subject.teacher ||
                        "Нет учителя"}]
                    <p>{subject.length} длина, {subject.break} перемена</p>
                    {#if "homework" in subject && subject.homework}
                        <p>{subject.homework}</p>
                    {/if}
                </li>
            {/each}
        </ul>
    {:else}
        <h2>Нет предметов</h2>
    {/if}
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "REDACTOR"}
    <a href="edit">Редактировать</a>
{/if}
