<script lang="ts">
    import { goto } from "$app/navigation";
    import { formatISOString } from "$lib/utils";

    function getTimetable() {
        const input = document.getElementById("date-select") as HTMLInputElement;

        goto(`date/${input.value}`);
    }
</script>

<input type="date" id="date-select" value={formatISOString(new Date)} />

<ul>
    <li>
        <a href="weekday/0">Воскресенье</a>
    </li>
    <li>
        <a href="weekday/1">Понедельник</a>
    </li>
    <li>
        <a href="weekday/2">Вторник</a>
    </li>
    <li>
        <a href="weekday/3">Среда</a>
    </li>
    <li>
        <a href="weekday/4">Четверг</a>
    </li>
    <li>
        <a href="weekday/5">Пятница</a>
    </li>
    <li>
        <a href="weekday/6">Cуббота</a>
    </li>
</ul>

<button on:click={getTimetable}>Узнать расписание</button>