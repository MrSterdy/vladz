<script lang="ts">
    import { goto } from "$app/navigation";
    import { formatISOString, capitalize } from "$lib/utils";
    import { weekdays } from "$lib/consts";

    function getTimetable() {
        const input = document.getElementById("date-select") as HTMLInputElement;

        goto(`date/${input.value}`);
    }
</script>

<input type="date" id="date-select" value={formatISOString(new Date)} />

<ul>
    {#each weekdays as weekday, i}
        <li>
            <a href="weekday/{i}">{capitalize(weekday)}</a>
        </li>
    {/each}
</ul>

<button on:click={getTimetable}>Узнать расписание</button>