<script lang="ts">
    import type { PageData } from "./$types";
    import { numberToTime } from "$lib/utils/time";
    import { goto } from "$app/navigation";
    import MainButton from "$lib/components/MainButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import type { DateSubject, WeekdaySubject } from "$lib/types";
    import { imageTypes } from "$lib/consts";
    import { fade } from "svelte/transition";

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

    const subjects = (data.dateTimetable?.subjects ?? data.weekdayTimetable?.subjects ?? []) as (WeekdaySubject | DateSubject)[];

    let selectedImage: string | null = null;
</script>

<section class="flex flex-col gap-2">
    {#if data.dateTimetable?.note}
        <div class="alert alert-info flex">
            <Icon name="info" class="icon-medium" />
            {data.dateTimetable.note}
        </div>
    {/if}

    {#if data.dayOff}
        <div class="flex flex-col items-center">
            <Icon name="beach" class="h-24 w-24 fill-base-content" />
            <p class="text-lg text-base-content">Выходной</p>
        </div>
    {:else}
        <div class="join join-vertical w-full">
            {#each subjects as subject, i}
                {#if subject.name}
                    {@const offset = offsets[i]}
                    <div
                        class="collapse join-item border bg-base-100"
                        class:collapse-arrow={subject.classroom ||
                            subject.teacher ||
                            ("homework" in subject &&
                                (subject.homework?.text ||
                                    subject.homework?.files.length))}
                    >
                        <input type="radio" name="accordion-subjects" />
                        <div class="collapse-title">
                            <span>{subject.position}.</span>

                            <span class="text-xl font-medium">{subject.name}</span>

                            <p class="m-0 flex gap-2 items-center">
                                <Icon name="clock" class="icon-small fill-base-content" />
                                {numberToTime(offset[0])} - {numberToTime(
                                    offset[1]
                                )}
                            </p>
                        </div>
                        {#if subject.classroom || subject.teacher || ("homework" in subject && (subject.homework.text || subject.homework.files.length))}
                            <div class="collapse-content">
                                {#if subject.teacher}
                                    <div class="flex gap-2">
                                        <Icon
                                            name="hat"
                                            class="icon-medium fill-base-content"
                                        />
                                        {subject.teacher}
                                    </div>
                                {/if}
                                {#if subject.classroom}
                                    <div class="flex gap-2">
                                        <Icon
                                            name="marker"
                                            class="icon-medium fill-base-content"
                                        />
                                        {subject.classroom}
                                    </div>
                                {/if}
                                {#if "homework" in subject && (subject.homework.text || subject.homework.files.length)}
                                    <div class="flex flex-col gap-2">
                                        <div class="flex gap-2">
                                            <Icon
                                                name="briefcase"
                                                class="icon-medium fill-base-content rounded-none"
                                            />

                                            <p class="m-0">{subject.homework.text || "Файлы ДЗ"}</p>
                                        </div>

                                        {#if subject.homework.files.length}
                                            {@const images = subject.homework.files.filter(f => imageTypes.includes(f.type))}
                                            {@const files = subject.homework.files.filter(f => !images.includes(f))}
                                            <div class="flex flex-col gap-2">
                                                {#if images.length}
                                                    <div class="bg-base-200 h-28 p-2 space-x-2 carousel rounded-box">
                                                        {#each images as image}
                                                            <button type="button" on:click={() => selectedImage = image.url} class="carousel-item">
                                                                <img class="m-0 w-full h-full" src={image.url} alt={image.name} />
                                                            </button>
                                                        {/each}
                                                    </div>
                                                {/if}

                                                {#if files.length}
                                                    <div class="flex gap-4 flex-wrap bg-base-200 rounded-box p-4">
                                                        {#each files as file}
                                                            <a href={file.url} class="flex items-center gap-2" download>
                                                                <Icon name="download" class="icon-small fill-base-content rounded-none" />
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
    <button transition:fade={{ duration: 100 }} on:click={() => selectedImage = null} class:hidden={!selectedImage} class="grid place-items-center w-full h-full fixed inset-0 m-auto [&:not(.hidden)]:bg-base-100/90">
        <img class="max-w-[90%] max-h-[90%] object-contain m-0 rounded" src={selectedImage} alt="" />
    </button>
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "EDITOR"}
    <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
