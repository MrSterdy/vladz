<script lang="ts">
    import { fade } from "svelte/transition";

    import type { PageData } from "./$types";

    import { goto } from "$app/navigation";

    import BackButton from "$lib/components/BackButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import MainButton from "$lib/components/MainButton.svelte";
    import Status from "$lib/components/Status.svelte";
    import { imageTypes } from "$lib/consts";
    import type { DateSubject, WeekdaySubject } from "$lib/types";
    import { numberToTime } from "$lib/utils/time";

    export let data: PageData;

    let totalOffset =
        data.dateTimetable?.offset ?? data.weekdayTimetable?.offset ?? 0;
    const offsets = (
        data.dateTimetable?.subjects ??
        data.weekdayTimetable?.subjects ??
        []
    ).map(subject => {
        const result = [totalOffset, totalOffset + subject.length];

        totalOffset += subject.length + subject.break;

        return result;
    });

    const subjects = (data.dateTimetable?.subjects ??
        data.weekdayTimetable?.subjects ??
        []) as (WeekdaySubject | DateSubject)[];

    let selectedImage: string | null = null;
</script>

<BackButton newPage="../../../" />

<section class="flex flex-col gap-2">
    {#if data.dateTimetable?.note}
        <div class="alert alert-info flex word-break">
            <Icon name="info" class="icon-medium shrink-0" />
            {data.dateTimetable.note}
        </div>
    {/if}

    {#if data.dayOff}
        <Status icon="beach" message="Отдыхай" />
    {:else}
        <div class="join join-vertical word-break w-full">
            {#each subjects as subject, i}
                {#if subject.name}
                    {@const offset = offsets[i]}
                    <div
                        class="collapse join-item border bg-base-100 rounded-box"
                        class:collapse-arrow={subject.classroom ||
                            subject.teacher ||
                            ("homework" in subject &&
                                (subject.homework?.text ||
                                    subject.homework?.files.length))}
                    >
                        <input type="radio" name="accordion-subjects" />
                        <div class="collapse-title">
                            <span>{subject.position}.</span>

                            <span class="text-xl font-medium"
                                >{subject.name}</span
                            >

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
                        {#if subject.classroom || subject.teacher || ("homework" in subject && (subject.homework.text || subject.homework.files.length))}
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
                                {#if "homework" in subject && (subject.homework.text || subject.homework.files.length)}
                                    <div class="flex flex-col gap-2">
                                        <div class="flex gap-2 items-center">
                                            <Icon
                                                name="briefcase"
                                                class="icon-medium fill-base-content shrink-0 self-start"
                                            />

                                            <div class="flex flex-col">
                                                <span
                                                    class="text-sm font-medium"
                                                    >Домашнее задание</span
                                                >
                                                {subject.homework.text ||
                                                    "Просмотреть файлы"}
                                            </div>
                                        </div>

                                        {#if subject.homework.files.length}
                                            {@const images =
                                                subject.homework.files.filter(
                                                    f =>
                                                        imageTypes.includes(
                                                            f.type
                                                        )
                                                )}
                                            {@const files =
                                                subject.homework.files.filter(
                                                    f => !images.includes(f)
                                                )}
                                            <div class="flex flex-col gap-2">
                                                {#if images.length}
                                                    <div
                                                        class="bg-base-200 h-28 p-2 space-x-2 carousel rounded-box"
                                                    >
                                                        {#each images as image}
                                                            <button
                                                                type="button"
                                                                on:click={() =>
                                                                    (selectedImage =
                                                                        image.url)}
                                                                class="carousel-item"
                                                            >
                                                                <img
                                                                    class="m-0 w-full h-full"
                                                                    src={image.url}
                                                                    alt={image.name}
                                                                />
                                                            </button>
                                                        {/each}
                                                    </div>
                                                {/if}

                                                {#if files.length}
                                                    <div
                                                        class="flex gap-4 flex-wrap bg-base-200 rounded-box p-4"
                                                    >
                                                        {#each files as file}
                                                            <a
                                                                href={file.url}
                                                                class="flex items-center gap-2"
                                                                download
                                                            >
                                                                <Icon
                                                                    name="download"
                                                                    class="icon-small fill-base-content"
                                                                />
                                                                {file.name}
                                                            </a>
                                                        {/each}
                                                    </div>
                                                {/if}
                                            </div>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</section>

{#if selectedImage}
    <button
        transition:fade={{ duration: 100 }}
        on:click={() => (selectedImage = null)}
        class:hidden={!selectedImage}
        class="w-full h-full fixed inset-0 z-10 [&:not(.hidden)]:bg-base-100/90"
    >
        <img
            class="max-w-[90%] max-h-[90%] object-contain m-auto rounded"
            src={selectedImage}
            alt=""
        />
    </button>
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "MONITOR" || data.groupUser?.role === "HELPER"}
    <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
