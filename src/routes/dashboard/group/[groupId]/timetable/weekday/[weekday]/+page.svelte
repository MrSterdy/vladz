<script lang="ts">
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { capitalize } from "$lib/utils";

    export let data: PageData;
</script>

<h1>{capitalize(["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"][parseInt($page.params["date"])])}</h1>
<p>{data.timetable.note || "Нет примечания"}</p>
<p>Начало занятий: спустя {data.timetable.offset} минут после полуночи</p>

{#if data.timetable.subjects.length}
    <ul>
        {#each data.timetable.subjects as subject}
            <li>
                {subject.name} [{subject.classroom || "Нет кабинета"}] [{subject.teacher || "Нет учителя"}]
                <p>{subject.length} длина, {subject.break} перемена</p>
                <p>{subject.homework || "Нет дз"}</p>
            </li>
        {/each}
    </ul>
{:else}
    <h2>Нет предметов</h2>
{/if}