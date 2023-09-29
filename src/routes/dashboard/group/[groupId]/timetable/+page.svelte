<script lang="ts">
    import { goto } from "$app/navigation";
    import { formatISOString } from "$lib/utils";

    function getTimetable() {
        const input = document.getElementById("date-select") as HTMLInputElement;

        goto(`date/${input.value}`);
    }
</script>

<input type="date" id="date-select" value={formatISOString(new Date)} />

<button on:click={getTimetable}>Узнать расписание</button>