<script lang="ts">
    import type { PageData } from "./$types";

    import { goto } from "$app/navigation";

    import MainButton from "$lib/components/MainButton.svelte";
    import Status from "$lib/components/Status.svelte";
    import { groupUserRoles } from "$lib/consts";
    import { capitalize } from "$lib/utils/string";

    export let data: PageData;
</script>

{#if data.group.users.length}
    <table class="table">
        <thead>
            <tr>
                <th />
                <th>Имя</th>
                <th>Роль</th>
            </tr>
        </thead>
        <tbody>
            {#each data.group.users.sort((a, b) => `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)) as user, i}
                <tr>
                    <th>{i + 1}</th>
                    <td class="word-break">{user.lastName} {user.firstName}</td>
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
    <Status icon="sad" message="Никого нет" />
{/if}

{#if data.user.role !== "USER" || data.groupUser?.role === "CURATOR"}
    <MainButton onClick={() => goto("edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
