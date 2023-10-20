<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";

    import type { PageData } from "./$types";

    import BackButton from "$lib/components/BackButton.svelte";
    import MainButton from "$lib/components/MainButton.svelte";
    import { handleError, handleUpdated } from "$lib/utils/form";

    export let data: PageData;

    const { form, enhance, constraints, errors } = superForm(data.form, {
        onUpdated: handleUpdated,
        onError: handleError,
        taintedMessage:
            "Вы действительно хотите покинуть страницу? Изменения, cделанные вами, не сохранятся"
    });

    let formEl: HTMLFormElement;
</script>

<BackButton newPage="../" />

<section>
    <h1 class="text-center">Настройки</h1>

    <form
        class="form-control card card-compact card-body card-actions bg-base-100"
        method="post"
        bind:this={formEl}
        use:enhance
    >
        <div class="w-full">
            <label class="label label-text" for="first-name">Имя</label>
            <input
                id="first-name"
                name="first_name"
                aria-invalid={$errors.first_name ? true : undefined}
                class="input input-primary input-bordered w-full"
                placeholder="Имя"
                bind:value={$form.first_name}
                {...$constraints.first_name}
            />
        </div>

        <div class="w-full">
            <label class="label label-text" for="last-name">Фамилия</label>
            <input
                id="last-name"
                name="last_name"
                aria-invalid={$errors.last_name ? true : undefined}
                placeholder="Фамилия"
                class="input input-primary input-bordered w-full"
                bind:value={$form.last_name}
                {...$constraints.last_name}
            />
        </div>

        <div class="w-full">
            <label class="label gap-3 justify-between w-full">
                <span class="label-text"
                    >Уведомлять об изменениях расписаний?</span
                >
                <input
                    type="checkbox"
                    bind:group={$form.notifications}
                    value="timetable"
                    name="notifications"
                    class="checkbox checkbox-primary"
                />
            </label>
            <label class="label gap-3 justify-between w-full">
                <span class="label-text">Уведомлять о новых заявках?</span>
                <input
                    type="checkbox"
                    bind:group={$form.notifications}
                    value="application_new"
                    name="notifications"
                    class="checkbox checkbox-primary"
                />
            </label>
        </div>

        <MainButton onClick={() => formEl.requestSubmit()} text="СОХРАНИТЬ" />
    </form>
</section>
