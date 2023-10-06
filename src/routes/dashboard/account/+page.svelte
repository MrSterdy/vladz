<script lang="ts">
    import type { PageData } from "./$types";

    import { userRoles } from "$lib/consts";
    import { capitalize } from "$lib/utils";
    import { goto } from "$app/navigation";
    import MainButton from "$lib/components/MainButton.svelte";

    export let data: PageData;
</script>

<h1>Аккаунт</h1>

<span>Имя: {data.user.firstName}</span>
<span>Фамилия: {data.user.lastName}</span>
<span>Роль: {capitalize(userRoles[data.user.role])}</span>
<span>ID: {data.user.id}</span>

<MainButton onClick={() => goto("/dashboard/account/settings")} text="РЕДАКТИРОВАТЬ" />
