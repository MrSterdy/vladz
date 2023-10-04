<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1>Аккаунт</h1>

<span>Имя: {data.user.firstName}</span>
<span>Фамилия: {data.user.lastName}</span>
<span>Роль: {data.user.role === "ADMIN"
        ? "Администратор"
        : data.user.role === "HELPER"
        ? "Помощник администратора"
        : "Пользователь"}</span>
<span>ID: {data.user.id}</span>

<a href="/dashboard/account/settings">Настройки</a>
