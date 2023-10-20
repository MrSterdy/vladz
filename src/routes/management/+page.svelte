<script lang="ts">
    import type { PageData } from "./$types";

    import { goto } from "$app/navigation";

    import BackButton from "$lib/components/BackButton.svelte";
    import MainButton from "$lib/components/MainButton.svelte";
    import Status from "$lib/components/Status.svelte";
    import { userRoles } from "$lib/consts";
    import { capitalize } from "$lib/utils/string";

    export let data: PageData;
</script>

<BackButton newPage="/" />

<h1 class="text-center">Руководство</h1>

{#if data.management.length}
    <table class="table">
        <thead>
            <tr>
                <th />
                <th>Имя</th>
                <th>Роль</th>
            </tr>
        </thead>
        <tbody>
            {#each data.management as user, i}
                <tr>
                    <th>{i + 1}</th>
                    <td class="word-break">{user.lastName} {user.firstName}</td>
                    <td>
                        <span class="badge badge-accent badge-outline">
                            {capitalize(userRoles[user.role])}
                        </span>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{:else}
    <Status icon="sad" message="Никого нет" />
{/if}

{#if data.user?.role === "ADMIN"}
    <MainButton onClick={() => goto("/management/edit")} text="РЕДАКТИРОВАТЬ" />
{/if}
