<script lang="ts">
    import type { PageData } from "./$types";

    import { enhance } from "$app/forms";

    export let data: PageData;
</script>

<h1>{data.group.name}</h1>
<h2>Код группы: {data.group.inviteCode}</h2>

{#if data.groupUser}
    {#if data.groupUser.role === "APPLICATION" && data.user.role === "USER"}
        <h2>Ваша заявка рассматривается</h2>
    {:else}
        <a href="composition">Участники</a>
        <a href="timetable">Расписание</a>
        <a href="subjects">Предметы</a>
        <a href="holidays">Выходные</a>
    {/if}

    <form method="post" use:enhance>
        <input type="submit" value="Покинуть группу" />
    </form>
{/if}

{#if data.user.role === "ADMIN" || data.user.role === "HELPER"}
    <a href="edit">Редактировать</a>
{/if}