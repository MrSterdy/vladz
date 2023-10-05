<script lang="ts">
    import type { PageData } from "./$types";

    import { userRoles } from "$lib/consts";
    import { capitalize } from "$lib/utils";

    export let data: PageData;
</script>

<h1>Аккаунт</h1>

<span>Имя: {data.user.firstName}</span>
<span>Фамилия: {data.user.lastName}</span>
<span>Роль: {capitalize(userRoles[data.user.role])}</span>
<span>ID: {data.user.id}</span>

<a href="/dashboard/account/settings">Настройки</a>
