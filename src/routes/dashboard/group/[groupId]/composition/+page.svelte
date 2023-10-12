<script lang="ts">
    import type { PageData } from "./$types";
    import { capitalize } from "$lib/utils/string";
    import { groupUserRoles } from "$lib/consts";
    import MainButton from "$lib/components/MainButton.svelte";
    import { goto } from "$app/navigation";
    import Icon from "$lib/components/Icon.svelte";

    export let data: PageData;

    const users = data.group.users.filter(u => u.role !== "APPLICATION");
</script>

{#if users.length}
    <table class="table table-md">
        <thead>
        <tr>
            <th></th>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Роль</th>
        </tr>
        </thead>
        <tbody>
        {#each users as user, i}
            <tr>
                <th>{i + 1}</th>
                <td>{user.lastName}</td>
                <td>{user.firstName}</td>
                <td>
                <span class="badge badge-accent badge-outline">
                    {capitalize(groupUserRoles[user.role])}
                </span>
                </td>
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

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR"}
    <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
