<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";

    import { enhance as kitEnhance } from "$app/forms";
    import MainButton from "$lib/components/MainButton.svelte";

    export let data: PageData;

    const { form, constraints, enhance } = superForm(data.form);

    let formEl: HTMLFormElement;

    const submitForm = () => formEl.requestSubmit();
</script>

<form method="post" action="?/update" bind:this={formEl} use:enhance>
    <h1>Редактирование информации группы {data.group.name}</h1>

    <span>Название:</span>
    <input name="name" bind:value={$form.name} {...$constraints.name} />

    <MainButton onClick={submitForm} text="СОХРАНИТЬ" />
</form>

<form method="post" action="?/delete" use:kitEnhance>
    <input type="submit" value="Удалить" />
</form>
