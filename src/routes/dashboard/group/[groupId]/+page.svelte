<script lang="ts">
    import type { PageData } from "./$types";

    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import MainButton from "$lib/components/MainButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import { groupUserRoles } from "$lib/consts";

    export let data: PageData;
</script>

<section class="flex flex-col justify-between h-full gap-5">
    <div class="card card-compact card-body bg-base-100 grow-0">
        <h2 class="card-title m-0 gap-3 justify-between">
            {data.group.name}
            {#if data.groupUser}
                <span class="badge badge-accent badge-outline">
                    {groupUserRoles[data.groupUser.role].toUpperCase()}
                </span>
            {/if}
        </h2>

        <ul class="text-primary flex justify-between gap-3">
            <li class="flex items-center gap-2">
                <Icon name="add-user" class="w-5 h-5 fill-base-content" />
                {data.group.inviteCode}
            </li>
            <li class="flex items-center gap-2">
                <Icon name="users" class="w-5 h-5 fill-base-content" />
                {data.group.users.length}
            </li>
        </ul>

        {#if data.groupUser}
            <form class="card-actions" method="post" use:enhance>
                <input
                    type="submit"
                    class="btn btn-error w-full"
                    value="Покинуть группу"
                />
            </form>
        {/if}
    </div>

    <div class="flex flex-wrap gap-2">
        <a
            role="button"
            href="subjects"
            class="btn btn-primary btn-outline grow basis-0">Предметы</a
        >
        <a role="button" href="composition" class="btn btn-primary grow basis-0"
            >Участники</a
        >
        <a role="button" href="timetable" class="btn btn-primary grow basis-0"
            >Расписание</a
        >
        <a
            role="button"
            href="holidays"
            class="btn btn-primary btn-outline grow basis-0">Выходные</a
        >

        {#if data.user.role === "ADMIN" || data.user.role === "HELPER"}
            <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
        {/if}
    </div>
</section>
