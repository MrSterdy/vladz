<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import MainButton from "$lib/components/MainButton.svelte";
    import { handleError, handleUpdated } from "$lib/utils/form";

    export let data: PageData;

    const { form, errors, constraints, enhance } = superForm(data.form, {
        onUpdated: handleUpdated,
        onError: handleError
    });

    let formEl: HTMLFormElement;
</script>

<form method="post" bind:this={formEl} use:enhance>
    <h1 class="text-center">Регистрация</h1>

    <div class="card card-compact card-body bg-base-100">
        <div class="w-full">
            <label for="first_name" class="label">
                <span class="label-text">Ваше имя?</span>
            </label>

            <input
                id="first_name"
                name="first_name"
                aria-invalid={$errors.first_name ? "true" : undefined}
                class="input input-primary input-bordered w-full"
                type="text"
                placeholder="Имя"
                bind:value={$form.first_name}
                {...$constraints.first_name}
            />
        </div>

        <div class="w-full">
            <label for="last_name" class="label">
                <span class="label-text">Ваша фамилия?</span>
            </label>

            <input
                id="last_name"
                name="last_name"
                aria-invalid={$errors.last_name ? "true" : undefined}
                type="text"
                placeholder="Фамилия"
                class="input input-primary input-bordered w-full"
                bind:value={$form.last_name}
                {...$constraints.last_name}
            />
        </div>
    </div>

    <MainButton
        onClick={() => formEl.requestSubmit()}
        text="ЗАРЕГИСТРИРОВАТЬСЯ"
    />
</form>
