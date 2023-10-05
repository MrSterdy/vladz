<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";

    import { enhance as kitEnhance } from "$app/forms";
    import { onDestroy, onMount } from "svelte";

    export let data: PageData;

    const { form, constraints, enhance } = superForm(data.form);

    let formEl: HTMLFormElement;

    const submitForm = () => formEl.requestSubmit();

    onMount(() => {
        window.Telegram.WebApp.MainButton.setText("СОХРАНИТЬ");
        window.Telegram.WebApp.MainButton.show();
        window.Telegram.WebApp.MainButton.onClick(submitForm);
    });

    onDestroy(() => {
        window.Telegram.WebApp.MainButton.hide();
        window.Telegram.WebApp.MainButton.offClick(submitForm);
    });
</script>

<form method="post" action="?/update" bind:this={formEl} use:enhance>
    <h1>Редактирование информации группы {data.group.name}</h1>

    <span>Название:</span> <input name="name" bind:value={$form.name} {...$constraints.name} />
</form>

<form method="post" action="?/delete" use:kitEnhance>
    <input type="submit" value="Удалить" />
</form>
