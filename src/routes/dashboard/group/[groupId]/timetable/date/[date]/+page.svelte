<script lang="ts">
    import type { PageData } from "./$types";
    import { numberToTime } from "$lib/utils/time";
    import { goto } from "$app/navigation";
    import MainButton from "$lib/components/MainButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import type { DateSubject, WeekdaySubject } from "$lib/types";
    import { imageTypes } from "$lib/consts";

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
</script>

<section class="flex flex-col gap-2">
    {#if data.dateTimetable?.note}
        <div class="alert alert-info flex">
            <Icon name="info" class="w-6 h-6" />
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
                        <input type="radio" />
                        <div class="collapse-title">
                            <span>{subject.position}.</span>

                            <span class="text-xl font-medium">{subject.name}</span>

                            <p class="m-0 flex gap-2 items-center">
                                <Icon name="clock" class="w-4 h-4 fill-base-content" />
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
                                            class="h-6 w-6 fill-base-content"
                                        />
                                        {subject.teacher}
                                    </div>
                                {/if}
                                {#if subject.classroom}
                                    <div class="flex gap-2">
                                        <Icon
                                            name="marker"
                                            class="h-6 w-6 fill-base-content"
                                        />
                                        {subject.classroom}
                                    </div>
                                {/if}
                                {#if "homework" in subject && (subject.homework.text || subject.homework.files.length)}
                                    <div class="flex flex-col gap-2">
                                        <div class="flex gap-2">
                                            <Icon
                                                name="briefcase"
                                                class="h-6 w-6 fill-base-content rounded-none"
                                            />

                                            <p class="m-0">{subject.homework.text || "Файлы ДЗ"}</p>
                                        </div>

                                        {#if subject.homework.files.length}
                                            {@const images = subject.homework.files.filter(f => imageTypes.includes(f.type))}
                                            {@const files = subject.homework.files.filter(f => !images.includes(f))}
                                            <div class="flex flex-col gap-2">
                                                {#if images.length}
                                                    <div class="bg-base-200 h-28 p-4 space-x-4 carousel rounded-box">
                                                        {#each images as image}
                                                            <div class="carousel-item">
                                                                <img class="m-0" src={image.url} alt={image.name} />
                                                            </div>
                                                        {/each}
                                                    </div>
                                                {/if}

                                                {#if files.length}
                                                    <div class="flex gap-4 flex-wrap bg-base-200 rounded-box p-4">
                                                        {#each files as file}
                                                            <a href={file.url} class="flex items-center gap-2" download>
                                                                <Icon name="download" class="h-4 w-4 fill-base-content rounded-none" />
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

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "REDACTOR"}
    <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
