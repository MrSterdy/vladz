<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";

    import type { PageData } from "./$types";

    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import BackButton from "$lib/components/BackButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Status from "$lib/components/Status.svelte";
    import { groupUserRoles } from "$lib/consts";
    import { handleError } from "$lib/utils/form";
    import { capitalize } from "$lib/utils/string";

    export let data: PageData;

    const { enhance } = superForm(data.form, {
        onError: handleError
    });

    $: currentType = $page.url.searchParams.get("type");
    $: if (currentType !== "applications" && currentType !== "members") {
        currentType = "members";
    }

    function switchType(newType: "applications" | "members") {
        if (newType === currentType) {
            return;
        }

        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("type", newType);

        goto(`?${params.toString()}`);
    }
</script>

<BackButton newPage="../" />

<div class="flex flex-col gap-4 h-full">
    <div class="tabs w-full flex gap-3 justify-around">
        <button
            class="tab tab-bordered"
            on:click={() => switchType("members")}
            class:tab-active={currentType === "members"}
        >
            Участники
        </button>
        <button
            class="tab tab-bordered"
            on:click={() => switchType("applications")}
            class:tab-active={currentType === "applications"}
        >
            Заявки
        </button>
    </div>

    {#if currentType === "members"}
        {#if data.group.users.length}
            <table class="table">
                <thead>
                    <tr>
                        <th />
                        <th>Имя</th>
                        <th>Роль</th>
                        <th />
                        <th />
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {#each data.group.users as user, i}
                        <tr>
                            <th>{i + 1}</th>
                            <td class="word-break"
                                >{user.lastName} {user.firstName}</td
                            >
                            <td>
                                <span class="badge"
                                      class:badge-primary={user.role === "CURATOR"}
                                      class:badge-secondary={user.role === "MONITOR"}
                                      class:badge-accent={user.role === "HELPER"}
                                      class:badge-neutral={user.role === "MEMBER"}
                                >
                                    {capitalize(groupUserRoles[user.role])}
                                </span>
                            </td>
                            {#if data.user.role !== "USER" || (user.id !== data.groupUser?.id && (data.groupUser?.role === "CURATOR" || (data.groupUser?.role === "MONITOR" && user.role !== "MONITOR" && user.role !== "CURATOR")))}
                                {#if user.role !== "CURATOR" && ((user.role !== "MONITOR" && (user.role !== "HELPER" || data.groupUser?.role === "CURATOR")) || data.user.role !== "USER")}
                                    <td class="p-0">
                                        <form
                                            method="post"
                                            action="?/promote"
                                            use:enhance
                                        >
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={user.id}
                                            />
                                            <button
                                                type="submit"
                                                class="btn btn-ghost p-0"
                                            >
                                                <Icon
                                                    name="promote"
                                                    class="icon-medium fill-success"
                                                />
                                            </button>
                                        </form>
                                    </td>
                                {/if}

                                {#if user.role !== "MEMBER"}
                                    <td class="p-0">
                                        <form
                                            method="post"
                                            action="?/demote"
                                            use:enhance
                                        >
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={user.id}
                                            />
                                            <button
                                                type="submit"
                                                class="btn btn-ghost p-0"
                                            >
                                                <Icon
                                                    name="demote"
                                                    class="icon-medium fill-error"
                                                />
                                            </button>
                                        </form>
                                    </td>
                                {/if}

                                <td class="p-0">
                                    <form
                                        method="post"
                                        action="?/remove"
                                        use:enhance
                                    >
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={user.id}
                                        />
                                        <button
                                            type="submit"
                                            class="btn btn-ghost p-0"
                                        >
                                            <Icon
                                                name="ban"
                                                class="icon-medium fill-error"
                                            />
                                        </button>
                                    </form>
                                </td>
                            {/if}
                        </tr>
                    {/each}
                </tbody>
            </table>
        {:else}
            <Status icon="sad" message="Никого нет" />
        {/if}
    {:else if data.group.applications.length}
        <table class="table">
            <thead>
                <tr>
                    <th />
                    <th>Имя</th>
                    <th />
                    <th />
                </tr>
            </thead>
            <tbody>
                {#each data.group.applications as user, i}
                    <tr>
                        <th>{i + 1}</th>
                        <td class="word-break"
                            >{user.lastName} {user.firstName}</td
                        >
                        <td class="p-0">
                            <form method="post" action="?/accept" use:enhance>
                                <input
                                    type="hidden"
                                    name="id"
                                    value={user.id}
                                />
                                <button type="submit" class="btn btn-ghost p-0">
                                    <Icon
                                        name="check"
                                        class="icon-medium fill-success"
                                    />
                                </button>
                            </form>
                        </td>
                        <td class="p-0">
                            <form method="post" action="?/deny" use:enhance>
                                <input
                                    type="hidden"
                                    name="id"
                                    value={user.id}
                                />
                                <button type="submit" class="btn btn-ghost p-0">
                                    <Icon
                                        name="cross"
                                        class="icon-medium fill-error"
                                    />
                                </button>
                            </form>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <Status icon="sad" message="Никого нет" />
    {/if}
</div>
