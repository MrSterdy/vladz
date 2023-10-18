<script lang="ts">
    import type { PageData } from "./$types";

    import { goto } from "$app/navigation";

    import Icon from "$lib/components/Icon.svelte";
    import MainButton from "$lib/components/MainButton.svelte";
    import Status from "$lib/components/Status.svelte";

    export let data: PageData;
</script>

{#if data.subjects.length}
    <div class="join join-vertical w-full">
        {#each data.subjects as subject}
            <div
                class="collapse join-item border bg-base-100"
                class:collapse-arrow={subject.teacher || subject.classroom}
            >
                <input type="radio" name="accordion-subjects" />
                <div class="collapse-title text-xl font-medium">
                    {subject.name}
                </div>
                {#if subject.teacher || subject.classroom}
                    <div class="collapse-content gap-2 flex flex-col">
                        {#if subject.teacher}
                            <span class="flex gap-2 items-center">
                                <Icon
                                    name="hat"
                                    class="icon-medium fill-base-content"
                                />
                                {subject.teacher}
                            </span>
                        {/if}
                        {#if subject.classroom}
                            <span class="flex gap-2 items-center">
                                <Icon
                                    name="marker"
                                    class="icon-medium fill-base-content"
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
    <Status icon="sad" message="Нет предметов" />
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR" || data.groupUser?.role === "EDITOR"}
    <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
