<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import { onDestroy, onMount } from "svelte";

    export let data: PageData;

    const { form, errors, constraints, enhance } = superForm(data.form);

    let formEl: HTMLFormElement;

    const submitForm = () => formEl.requestSubmit();

    onMount(() => {
        window.Telegram.WebApp.MainButton.setText("ЗАРЕГИСТРИРОВАТЬСЯ");
        window.Telegram.WebApp.MainButton.show();
        window.Telegram.WebApp.MainButton.onClick(submitForm);
    });

    onDestroy(() => {
        window.Telegram.WebApp.MainButton.hide();
        window.Telegram.WebApp.MainButton.offClick(submitForm);
    });
</script>

<form method="post" bind:this={formEl} use:enhance>
    <input
        name="first_name"
        aria-invalid={$errors.first_name ? "true" : undefined}
        type="text"
        placeholder="Имя"
        bind:value={$form.first_name}
        {...$constraints.first_name}
    />

    <input
        name="last_name"
        aria-invalid={$errors.last_name ? "true" : undefined}
        type="text"
        placeholder="Фамилия"
        bind:value={$form.last_name}
        {...$constraints.last_name}
    />
</form>
