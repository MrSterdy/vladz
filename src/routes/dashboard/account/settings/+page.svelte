<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import MainButton from "$lib/components/MainButton.svelte";

    export let data: PageData;

    const { form, enhance, constraints } = superForm(data.form);

    let inputEl: HTMLInputElement;

    const submitForm = () => inputEl.click();
</script>

<h1>Настройки аккаунта</h1>

<form method="post" use:enhance>
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

    <input type="submit" bind:this={inputEl} class="hidden" />
    <MainButton onClick={submitForm} text="СОХРАНИТЬ" />
</form>
