<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import MainButton from "$lib/components/MainButton.svelte";

    export let data: PageData;

    const { form, constraints, enhance } = superForm(data.form, {
        dataType: "json"
    });

    let formEl: HTMLFormElement;

    const submitForm = () => formEl.requestSubmit();

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

<h1>Редактирование предметов</h1>

<form method="post" bind:this={formEl} use:enhance>
    <ul>
        {#each $form.subjects as _, i}
            <li>
                <input
                    type="text"
                    placeholder="Название"
                    bind:value={$form.subjects[i].name}
                    {...$constraints.subjects?.name}
                />
                <input
                    type="text"
                    placeholder="Учитель"
                    bind:value={$form.subjects[i].teacher}
                    {...$constraints.subjects?.teacher}
                />
                <input
                    type="text"
                    placeholder="Класс"
                    bind:value={$form.subjects[i].classroom}
                    {...$constraints.subjects?.classroom}
                />

                <button type="button" on:click={() => removeSubject(i)}>
                    Удалить
                </button>
            </li>
        {/each}
    </ul>

    <button type="button" on:click={addSubject}>Создать предмет</button>

    <MainButton onClick={submitForm} text="СОХРАНИТЬ" />
</form>
