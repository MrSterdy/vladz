<script lang="ts">
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";
    import MainButton from "$lib/components/MainButton.svelte";
    import Icon from "$lib/components/Icon.svelte";

    export let data: PageData;
</script>

{#if data.subjects.length}
    <div class="join join-vertical w-full">
        {#each data.subjects as subject}
            <div
                class="collapse join-item border bg-base-100"
                class:collapse-arrow={subject.teacher || subject.classroom}
            >
                <input type="radio" name="my-accordion-4" />
                <div class="collapse-title text-xl font-medium">
                    {subject.name}
                </div>
                {#if subject.teacher || subject.classroom}
                    <div class="collapse-content gap-2 flex flex-col">
                        {#if subject.teacher}
                            <span class="flex gap-2 items-center">
                                <Icon
                                    name="hat"
                                    class="h-6 w-6 fill-base-content"
                                />
                                {subject.teacher}
                            </span>
                        {/if}
                        {#if subject.classroom}
                            <span class="flex gap-2 items-center">
                                <Icon
                                    name="marker"
                                    class="h-6 w-6 fill-base-content"
                                />
                                {subject.classroom}
                            </span>
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    </div>
{:else}
    <div class="flex flex-col items-center">
        <Icon name="sad" class="h-24 w-24 fill-base-content" />
        <p class="text-lg text-base-content">Нет выходных</p>
    </div>
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "EDITOR"}
    <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
