<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";

    export let data: PageData;

    const { enhance } = superForm(data.form);
</script>

<h1>Состав группы {data.group.name}:</h1>

{#if data.group.users.length}
    <ul>
        {#each data.group.users as groupUser}
            <li>
                <h2>
                    {groupUser.lastName}
                    {groupUser.firstName} [{groupUser.role}]
                </h2>
                {#if groupUser.id !== data.groupUser?.id && (data.user.role !== "USER" || data.groupUser?.role === "CURATOR")}
                    {#if groupUser.role !== "CURATOR"}
                        <form method="post" action="?/promote" use:enhance>
                            <input
                                type="hidden"
                                name="id"
                                value={groupUser.id}
                            />
                            <input type="submit" value="Повысить" />
                        </form>
                    {/if}

                    {#if groupUser.role !== "APPLICATION" && (data.user.role !== "USER" || groupUser.role !== "CURATOR")}
                        <form method="post" action="?/demote" use:enhance>
                            <input
                                type="hidden"
                                name="id"
                                value={groupUser.id}
                            />
                            <input type="submit" value="Понизить" />
                        </form>
                    {/if}

                    <form method="post" action="?/remove" use:enhance>
                        <input type="hidden" name="id" value={groupUser.id} />
                        <input type="submit" value="Изгнать" />
                    </form>
                {/if}
            </li>
        {/each}
    </ul>
{:else}
    <h1>Никого нет...</h1>
{/if}
