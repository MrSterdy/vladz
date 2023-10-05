<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import MainButton from "$lib/components/MainButton.svelte";

    export let data: PageData;

    const { form, enhance, constraints } = superForm(data.form);

    let formEl: HTMLFormElement;

    const submitForm = () => formEl.requestSubmit();
</script>

<h1>Настройки аккаунта</h1>

<form method="post" bind:this={formEl} use:enhance>
    <input
        name="first_name"
        placeholder="Имя"
        bind:value={$form.first_name}
        {...$constraints.first_name}
    />

    <input
        name="last_name"
        placeholder="Фамилия"
        bind:value={$form.last_name}
        {...$constraints.last_name}
    />

    <MainButton onClick={submitForm} text="СОХРАНИТЬ" />
</form>
