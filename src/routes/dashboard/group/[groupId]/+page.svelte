<script lang="ts">
    import type { PageData } from "./$types";

    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import MainButton from "$lib/components/MainButton.svelte";

    export let data: PageData;
</script>

<h1>{data.group.name}</h1>
<h2>Код группы: {data.group.inviteCode}</h2>

{#if (data.groupUser && data.groupUser.role !== "APPLICATION") || data.user.role !== "USER"}
    <a href="composition">Участники</a>
    <a href="timetable">Расписание</a>
    <a href="subjects">Предметы</a>
    <a href="holidays">Выходные</a>
{/if}

{#if data.groupUser}
    <form method="post" use:enhance>
        <input type="submit" value="Покинуть группу" />
    </form>
{/if}

{#if data.user.role === "ADMIN" || data.user.role === "HELPER"}
    <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
{/if}