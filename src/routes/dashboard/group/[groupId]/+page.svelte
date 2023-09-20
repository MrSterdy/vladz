<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1>{data.group.name}</h1>
<a href="composition">Участники</a>
<a href="timetable">Расписание</a>