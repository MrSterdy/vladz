<script lang="ts">
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { capitalize, numberToTime } from "$lib/utils";
    import { weekdays } from "$lib/consts";

    export let data: PageData;
</script>

<h1>{capitalize(weekdays[parseInt($page.params["weekday"])])}</h1>
<p>{data.timetable.note || "Нет примечания"}</p>
<p>Начало занятий: {numberToTime(data.timetable.offset)}</p>

{#if data.timetable.subjects.length}
    <ul>
        {#each data.timetable.subjects as subject}
            <li>
                {subject.name} [{subject.classroom || "Нет кабинета"}] [{subject.teacher || "Нет учителя"}]
                <p>{subject.length} длина, {subject.break} перемена</p>
            </li>
        {/each}
    </ul>
{:else}
    <h2>Нет предметов</h2>
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "REDACTOR"}
    <a href="edit">Редактировать</a>
{/if}