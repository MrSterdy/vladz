<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";

    import type { PageData } from "./$types";

    import { enhance as kitEnhance } from "$app/forms";

    import MainButton from "$lib/components/MainButton.svelte";
    import { handleError, handleUpdated } from "$lib/utils/form";
    import { showConfirm } from "$lib/utils/telegram";
    import BackButton from "$lib/components/BackButton.svelte";

    export let data: PageData;

    const { form, constraints, enhance, errors } = superForm(data.form, {
        onUpdated: handleUpdated,
        onError: handleError
    });

    let formEl: HTMLFormElement;

    let delFormEl: HTMLFormElement;

    function confirmDeletion() {
        showConfirm("Вы действительно хотите удалить группу?", () =>
            delFormEl.requestSubmit()
        );
    }
</script>

<BackButton newPage="../" />

<section class="card card-compact card-body bg-base-100">
    <form method="post" action="?/update" bind:this={formEl} use:enhance>
        <div class="w-full">
            <label class="label label-text" for="name">Название</label>
            <input
                class="input input-primary input-bordered w-full"
                id="name"
                name="name"
                aria-invalid={$errors.name ? true : undefined}
                bind:value={$form.name}
                {...$constraints.name}
            />
        </div>
    </form>

    <form method="post" action="?/delete" bind:this={delFormEl} use:kitEnhance>
        <button
            class="btn btn-error w-full"
            type="button"
            on:click={confirmDeletion}
        >
            Удалить
        </button>
    </form>

    <MainButton onClick={() => formEl.requestSubmit()} text="СОХРАНИТЬ" />
</section>
