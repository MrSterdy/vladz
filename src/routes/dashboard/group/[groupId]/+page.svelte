<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1>{data.group.name}</h1>
<a href="composition">Участники</a>
<a href="timetable">Расписание</a>
<a href="subjects">Предметы</a>
<a href="holidays">Выходные</a>

{#if data.user.role === "ADMIN" || data.user.role === "HELPER"}
    <a href="edit">Редактировать</a>
{/if}