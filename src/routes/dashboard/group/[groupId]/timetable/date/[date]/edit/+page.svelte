<script lang="ts">
    import type { PageData } from "./$types";
    import { capitalize, timeToNumber } from "$lib/utils";
    import { page } from "$app/stores";
    import { superForm } from "sveltekit-superforms/client";
    import dayjs from "dayjs";
    import { numberToTime } from "$lib/utils/index.js";
    import { onDestroy, onMount } from "svelte";

    export let data: PageData;

    const { form, enhance, constraints } = superForm(data.form, {
        dataType: "json"
    });

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

    function updateTime(this: HTMLInputElement) {
        $form.offset = timeToNumber(this.value);
    }

    function addSubject() {
        $form.subjects = [
            ...$form.subjects,
            {
                name: "",
                length: data.weekdayTimetable!.subjectLength,
                break: data.weekdayTimetable!.subjectBreak,
                classroom: null,
                teacher: null,
                position: $form.subjects.length
                    ? Math.max(
                    ...$form.subjects.map(subject => subject.position)
                ) + 1
                    : 1,
                homework: null
            }
        ];
    }

    function removeSubject(position: number) {
        $form.subjects = $form.subjects.filter(
            subject => subject.position !== position
        );
    }
</script>

<h1>
    {capitalize(dayjs($page.params["date"]).format("MMMM D, YYYY"))}: Редактирование
</h1>

<form method="post" bind:this={formEl} use:enhance>
    <input
        on:change={updateTime}
        name="offset"
        type="time"
        value={numberToTime($form.offset)}
        required
    />
    <input
        name="note"
        type="text"
        placeholder="Примечание"
        bind:value={$form.note}
        {...$constraints.note}
    />

    <ul>
        {#each $form.subjects as _, i}
            <li>
                <input
                    placeholder="Название предмета"
                    type="text"
                    bind:value={$form.subjects[i].name}
                    {...$constraints.subjects?.name}
                />
                <input
                    placeholder="Длина предмета"
                    type="number"
                    bind:value={$form.subjects[i].length}
                    {...$constraints.subjects?.length}
                />
                <input
                    placeholder="Перемена предмета"
                    type="number"
                    bind:value={$form.subjects[i].break}
                    {...$constraints.subjects?.break}
                />
                <input
                    placeholder="Учитель"
                    type="text"
                    bind:value={$form.subjects[i].teacher}
                    {...$constraints.subjects?.teacher}
                />
                <input
                    placeholder="Класс"
                    type="text"
                    bind:value={$form.subjects[i].classroom}
                    {...$constraints.subjects?.classroom}
                />
                <input
                    placeholder="Позиция"
                    type="number"
                    bind:value={$form.subjects[i].position}
                    {...$constraints.subjects?.position}
                />
                <input
                    placeholder="Домашнее задание"
                    type="text"
                    bind:value={$form.subjects[i].homework}
                    {...$constraints.subjects?.homework}
                />

                <button
                    type="button"
                    on:click={() => removeSubject($form.subjects[i].position)}
                >
                    Убрать
                </button>
            </li>
        {/each}
    </ul>

    <button type="button" on:click={addSubject}>Добавить предмет</button>
</form>
