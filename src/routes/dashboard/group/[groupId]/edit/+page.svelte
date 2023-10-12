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

<section class="card card-compact card-body bg-base-100">
    <form method="post" action="?/update" bind:this={formEl} use:enhance>
        <div class="w-full">
            <label class="label label-text" for="name">Название</label>
            <input
                class="input input-primary input-bordered w-full"
                id="name"
                name="name"
                bind:value={$form.name}
                {...$constraints.name}
            />
        </div>
    </form>

    <form method="post" action="?/delete" use:kitEnhance>
        <input class="btn btn-error w-full" type="submit" value="Удалить" />
    </form>

    <MainButton onClick={submitForm} text="СОХРАНИТЬ" />
</section>
