<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import MainButton from "$lib/components/MainButton.svelte";
    import { handleError, handleUpdated } from "$lib/utils/form";

    export let data: PageData;

    const { form, constraints, enhance } = superForm(data.form, {
        dataType: "json",
        onUpdated: handleUpdated,
        onError: handleError
    });

    let formEl: HTMLFormElement;

    function addSubject() {
        $form.subjects = [
            ...$form.subjects,
            { name: "", teacher: null, classroom: null }
        ];
    }

    function removeSubject(index: number) {
        $form.subjects = $form.subjects.filter((_, i) => i !== index);
    }
</script>

<form
    method="post"
    class="flex flex-col gap-2"
    bind:this={formEl}
    use:enhance
>
    <div class="join join-vertical w-full">
        {#each $form.subjects as _, i}
            <div class="collapse collapse-arrow join-item border bg-base-100">
                <input type="radio" name="my-accordion-4" />
                <div class="collapse-title text-xl font-medium">
                    {$form.subjects[i].name}
                </div>
                <div class="collapse-content gap-2 flex flex-col">
                    <div class="w-full">
                        <label for="name-{i}" class="label">
                            <span class="label-text">Название</span>
                        </label>

                        <input
                            id="name-{i}"
                            type="text"
                            placeholder="Название"
                            class="w-full input input-bordered input-primary"
                            bind:value={$form.subjects[i].name}
                            {...$constraints.subjects?.name}
                        />
                    </div>
                    <div class="w-full">
                        <label for="teacher-{i}" class="label">
                            <span class="label-text">Учитель</span>
                        </label>

                        <input
                            id="teacher-{i}"
                            type="text"
                            placeholder="Учитель"
                            class="w-full input input-secondary input-bordered"
                            bind:value={$form.subjects[i].teacher}
                            {...$constraints.subjects?.teacher}
                        />
                    </div>
                    <div class="w-full">
                        <label for="classroom-{i}" class="label">
                            <span class="label-text">Кабинет</span>
                        </label>

                        <input
                            id="classroom-{i}"
                            type="text"
                            placeholder="Класс"
                            class="w-full input input-secondary input-bordered"
                            bind:value={$form.subjects[i].classroom}
                            {...$constraints.subjects?.classroom}
                        />
                    </div>

                    <button type="button" class="btn btn-error" on:click={() => removeSubject(i)}>
                        Удалить
                    </button>
                </div>
            </div>
        {/each}
    </div>

    <button type="button" class="btn btn-primary w-full" on:click={addSubject}>Создать предмет</button>

    <MainButton onClick={() => formEl.requestSubmit()} text="СОХРАНИТЬ" />
</form>
