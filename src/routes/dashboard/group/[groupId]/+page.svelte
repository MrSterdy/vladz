<script lang="ts">
    import type { PageData } from "./$types";

    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import MainButton from "$lib/components/MainButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import { groupUserRoles, weekdays } from "$lib/consts";
    import { formatISOString } from "$lib/utils/time";
    import { capitalize } from "$lib/utils/string";
    import { handleKit } from "$lib/utils/form";

    export let data: PageData;

    let timetableModal: HTMLDialogElement;

    function showTimetable() {
        timetableModal.showModal();
    }

    let activeTimetableTab: "date" | "weekday" = "date";

    let selectedDate = formatISOString(new Date());
    let weekdaySelect: HTMLSelectElement;

    function getTimetable() {
        return activeTimetableTab === "date"
            ? goto(`timetable/date/${selectedDate}`)
            : goto(`timetable/weekday/${weekdaySelect.value}`);
    }
</script>

<section class="flex flex-col justify-between h-full gap-5">
    <div class="card card-compact card-body bg-base-100 grow-0">
        <h1 class="card-title m-0 gap-3 justify-between">
            {data.group.name}
            {#if data.groupUser}
                <span class="mt-1 badge badge-accent badge-outline">
                    {groupUserRoles[data.groupUser.role].toUpperCase()}
                </span>
            {/if}
        </h1>

        <div class="text-accent-content flex justify-between gap-3">
            <div class="flex items-center gap-2">
                <Icon name="add-user" class="w-5 h-5 fill-base-content" />
                {data.group.inviteCode}
            </div>
            <div class="flex items-center gap-2">
                <Icon name="users" class="w-5 h-5 fill-base-content" />
                {data.group.users.length}
            </div>
        </div>

        {#if data.groupUser}
            <form class="card-actions" method="post" use:enhance={() => handleKit(`Вы покинули группу "${data.group.name}"`)}>
                <input
                    type="submit"
                    class="btn btn-error w-full"
                    value="Покинуть группу"
                />
            </form>
        {/if}
    </div>

    <div class="flex flex-wrap gap-2">
        <a role="button" href="composition" class="btn btn-primary grow basis-0"
            >Участники</a
        >
        <button on:click={showTimetable} class="btn btn-primary grow basis-0"
            >Расписание</button
        >
        <dialog bind:this={timetableModal} class="modal">
            <div class="modal-box flex flex-col gap-3">
                <div class="tabs w-full flex gap-3 justify-around">
                    <button
                        class="tab tab-bordered"
                        on:click={() => (activeTimetableTab = "date")}
                        class:tab-active={activeTimetableTab === "date"}
                    >
                        Дата
                    </button>
                    <button
                        class="tab tab-bordered"
                        on:click={() => (activeTimetableTab = "weekday")}
                        class:tab-active={activeTimetableTab === "weekday"}
                    >
                        День
                    </button>
                </div>

                {#if activeTimetableTab === "date"}
                    <input
                        class="w-full input input-bordered input-primary"
                        type="date"
                        bind:value={selectedDate}
                    />
                {:else}
                    <select bind:this={weekdaySelect} class="select select-bordered select-primary">
                        {#each weekdays as weekday, i}
                            <option value={i}>
                                {capitalize(weekday)}
                            </option>
                        {/each}
                    </select>
                {/if}

                <button class="btn btn-primary" on:click={getTimetable}>Узнать расписание</button>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>Закрыть</button>
            </form>
        </dialog>
        <a
            role="button"
            href="subjects"
            class="btn btn-primary btn-outline grow basis-0">Предметы</a
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
