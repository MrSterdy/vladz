<script lang="ts">
    import type { PageData } from "./$types";
    import Icon from "$lib/components/Icon.svelte";
    import { page } from "$app/stores";
    import { capitalize } from "$lib/utils/string";
    import { weekdays } from "$lib/consts";
    import { humanize, parseDate } from "$lib/utils/time";

    export let data: PageData;

    $: groupPath = $page.url.pathname
        .split(/^\/dashboard\/group\/\d+/)
        .join("");
</script>

<section class="flex flex-col h-full">
    <div class="breadcrumbs pt-0">
        <ul class="m-0 p-0">
            <li class="m-0 p-0">
                <a
                    href="/dashboard/group/{data.group.id}"
                    class:disabled={groupPath === "/"}
                >
                    <Icon
                        name="home"
                        class="fill-base-content icon-small mr-2"
                    />
                    {data.group.name}
                </a>
            </li>
            {#if groupPath.startsWith("/composition")}
                <li class="m-0 p-0">
                    <a
                        href="/dashboard/group/{data.group.id}/composition"
                        class:disabled={groupPath === "/composition/"}
                    >
                        <Icon
                            name="users"
                            class="fill-base-content icon-small mr-2"
                        />
                        Участники
                    </a>
                </li>
            {/if}
            {#if groupPath.startsWith("/timetable")}
                {@const timetablePath = groupPath.split("/")}
                {#if timetablePath.length >= 4}
                    <li class="m-0 p-0">
                        <a
                            href="/dashboard/group/{data.group
                                .id}/timetable/{timetablePath[2]}/{timetablePath[3]}"
                            class:disabled={timetablePath.length === 5}
                        >
                            <Icon
                                name="day"
                                class="fill-base-content icon-small mr-2"
                            />
                            {#if timetablePath[2] === "weekday"}
                                {capitalize(
                                    weekdays[parseInt(timetablePath[3])]
                                )}
                            {:else}
                                {capitalize(
                                    humanize(parseDate(timetablePath[3]))
                                )}
                            {/if}
                        </a>
                    </li>
                {/if}
            {/if}
            {#if groupPath.startsWith("/holidays")}
                <li class="m-0 p-0">
                    <a
                        href="/dashboard/group/{data.group.id}/holidays"
                        class:disabled={groupPath === "/holidays/"}
                    >
                        <Icon
                            name="beach"
                            class="fill-base-content icon-small mr-2"
                        />
                        Выходные
                    </a>
                </li>
            {/if}
            {#if groupPath.startsWith("/subjects")}
                <li class="m-0 p-0">
                    <a
                        href="/dashboard/group/{data.group.id}/subjects"
                        class:disabled={groupPath === "/subjects/"}
                    >
                        <Icon
                            name="users"
                            class="fill-base-content icon-small mr-2"
                        />
                        Предметы
                    </a>
                </li>
            {/if}
            {#if groupPath.includes("/edit")}
                <li class="m-0 p-0">
                    <Icon
                        name="pencil"
                        class="fill-base-content icon-small mr-2"
                    />
                    Редактирование
                </li>
            {/if}
        </ul>
    </div>

    <section class="grow">
        <slot />
    </section>
</section>
