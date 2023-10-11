<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import MainButton from "$lib/components/MainButton.svelte";

    export let data: PageData;

    const { form, errors, constraints, enhance } = superForm(data.form);

    let formEl: HTMLFormElement;

    const submitForm = () => formEl.requestSubmit();
</script>

<form method="post" bind:this={formEl} use:enhance>
    <h1 class="text-center">Регистрация</h1>

    <div class="card card-compact card-body bg-base-100">
        <input
            name="first_name"
            aria-invalid={$errors.first_name ? "true" : undefined}
            class="input input-primary input-bordered"
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
            class="input input-primary input-bordered"
            bind:value={$form.last_name}
            {...$constraints.last_name}
        />
    </div>

    <MainButton onClick={submitForm} text="ЗАРЕГИСТРИРОВАТЬСЯ" />
</form>
