<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import { capitalize } from "$lib/utils/string";
    import { groupUserRoles } from "$lib/consts";
    import Icon from "$lib/components/Icon.svelte";

    export let data: PageData;

    const { enhance } = superForm(data.form);
</script>

{#if data.group.users.length}
    <table class="table table-md">
        <thead>
        <tr>
            <th></th>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Роль</th>
            <th></th>
            <th></th>
            <th></th>
        </tr>
        </thead>
        <tbody class="break-all">
        {#each data.group.users as user, i}
            <tr>
                <th>{i + 1}</th>
                <td>{user.lastName}</td>
                <td>{user.firstName}</td>
                <td class="break-normal">
                <span class="badge badge-accent badge-outline">
                    {capitalize(groupUserRoles[user.role])}
                </span>
                </td>
                {#if user.id !== data.groupUser?.id && (data.user.role !== "USER" || data.groupUser?.role === "CURATOR")}
                    {#if user.role !== "CURATOR"}
                        <td class="p-0">
                            <form method="post" action="?/promote" use:enhance>
                                <input
                                    type="hidden"
                                    name="id"
                                    value={user.id}
                                />
                                <button type="submit" class="btn btn-ghost p-0">
                                    <Icon name="promote" class="h-6 w-6 fill-success" />
                                </button>
                            </form>
                        </td>
                    {/if}

                    {#if user.role !== "APPLICATION" && user.role !== "STUDENT" && (data.user.role !== "USER" || user.role !== "CURATOR")}
                        <td class="p-0">
                            <form method="post" action="?/demote" use:enhance>
                                <input
                                    type="hidden"
                                    name="id"
                                    value={user.id}
                                />
                                <button type="submit" class="btn btn-ghost p-0">
                                    <Icon name="demote" class="h-6 w-6 fill-error" />
                                </button>
                            </form>
                        </td>
                    {/if}

                    <td class="p-0">
                        <form method="post" action="?/remove" use:enhance>
                            <input type="hidden" name="id" value={user.id} />
                            <button type="submit" class="btn btn-ghost p-0">
                                <Icon name="ban" class="h-6 w-6 fill-error" />
                            </button>
                        </form>
                    </td>
                {/if}
            </tr>
        {/each}
        </tbody>
    </table>
{:else}
    <div class="flex flex-col items-center">
        <Icon name="sad" class="h-24 w-24 fill-base-content" />
        <p class="text-lg text-base-content">Никого нет</p>
    </div>
{/if}
