<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";

    import { enhance as kitEnhance } from "$app/forms";

    export let data: PageData;

    const { form, constraints, enhance } = superForm(data.form);
</script>

<form method="post" action="?/update" use:enhance>
    <h1>Редактирование информации группы {data.group.name}</h1>

    <span>Название:</span> <input name="name" bind:value={$form.name} {...$constraints.name} />

    <input type="submit" value="Сохранить" />
</form>

<form method="post" action="?/delete" use:kitEnhance>
    <input type="submit" value="Удалить" />
</form>
