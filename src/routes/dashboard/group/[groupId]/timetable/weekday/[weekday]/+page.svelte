<script lang="ts">
    import type { PageData } from "./$types";

    import { goto } from "$app/navigation";

    import BackButton from "$lib/components/BackButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import MainButton from "$lib/components/MainButton.svelte";
    import Status from "$lib/components/Status.svelte";
    import { numberToTime } from "$lib/utils/time";

    export let data: PageData;

    let totalOffset = data.timetable.offset;
    const offsets = data.timetable.subjects.map(subject => {
        const result = [totalOffset, totalOffset + subject.length];

        totalOffset += subject.length + subject.break;

        return result;
    });
</script>

<BackButton newPage="../../../" />

{#if data.timetable.subjects.filter(s => s.name).length}
    <section class="join join-vertical word-break w-full">
        {#each data.timetable.subjects as subject, i}
            {#if subject.name}
                {@const offset = offsets[i]}
                <div
                    class="collapse join-item border bg-base-100 rounded-box"
                    class:collapse-arrow={subject.classroom || subject.teacher}
                >
                    <input type="radio" name="accordion-subjects" />
                    <div class="collapse-title">
                        <span>{subject.position}.</span>

                        <span class="text-xl font-medium">{subject.name}</span>

                        <p class="m-0 flex gap-2 items-center">
                            <Icon
                                name="clock"
                                class="icon-small fill-base-content shrink-0"
                            />
                            {numberToTime(offset[0])} - {numberToTime(
                                offset[1]
                            )}
                        </p>
                    </div>
                    {#if subject.classroom || subject.teacher}
                        <div class="collapse-content">
                            {#if subject.teacher}
                                <div class="flex gap-2 items-center">
                                    <Icon
                                        name="hat"
                                        class="icon-medium fill-base-content shrink-0 self-start"
                                    />
                                    <div class="flex flex-col">
                                        <span class="text-sm font-medium"
                                            >Преподаватель</span
                                        >
                                        {subject.teacher}
                                    </div>
                                </div>
                            {/if}
                            {#if subject.classroom}
                                <div class="flex gap-2 items-center">
                                    <Icon
                                        name="marker"
                                        class="icon-medium fill-base-content shrink-0 self-start"
                                    />
                                    <div class="flex flex-col">
                                        <span class="text-sm font-medium"
                                            >Кабинет</span
                                        >
                                        {subject.classroom}
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>
            {/if}
        {/each}
    </section>
{:else}
    <Status icon="beach" message="Отдыхай" />
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "MONITOR" || data.groupUser?.role === "HELPER"}
    <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
