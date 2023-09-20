<script lang="ts">
    import { goto } from "$app/navigation";

    function getTimetable() {
        const input = document.getElementById("date-select") as HTMLInputElement;

        goto(`date/${input.value}`);
    }
</script>

<input type="date" id="date-select" value="{new Date().toISOString().split('T')[0]}" />

<button on:click={getTimetable}>Узнать расписание</button>