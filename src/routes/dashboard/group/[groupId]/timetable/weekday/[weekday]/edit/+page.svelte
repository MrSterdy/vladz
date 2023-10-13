<script lang="ts">
    import type { PageData } from "./$types";
    import { capitalize } from "$lib/utils/string";
    import { numberToTime, timeToNumber } from "$lib/utils/time";
    import { page } from "$app/stores";
    import { superForm } from "sveltekit-superforms/client";
    import { weekdays } from "$lib/consts";
    import MainButton from "$lib/components/MainButton.svelte";

    export let data: PageData;

    const { form, enhance, constraints } = superForm(data.form, {
        dataType: "json"
    });

    let formEl: HTMLFormElement;

    const submitForm = () => formEl.requestSubmit();

    function updateTime(this: HTMLInputElement) {
        $form.offset = timeToNumber(this.value);
    }

    function addSubject() {
        $form.subjects = [
            ...$form.subjects,
            {
                name: "",
                length: $form.subjectLength,
                break: $form.subjectBreak,
                classroom: null,
                teacher: null,
                position: $form.subjects.length
                    ? Math.max(
                          ...$form.subjects.map(subject => subject.position)
                      ) + 1
                    : 1
            }
        ];
    }

    function removeSubject(position: number) {
        $form.subjects = $form.subjects.filter(
            subject => subject.position !== position
        );
    }

    function updateSubject(subjectIndex: number) {
        const newName = $form.subjects[subjectIndex]!.name;

        const subject = data.subjects.find(s => s.name === newName);
        if (!subject) {
            return;
        }

        $form.subjects[subjectIndex]!.classroom = subject.classroom;
        $form.subjects[subjectIndex]!.teacher = subject.teacher;
    }
</script>

<h1>
    {capitalize(weekdays[parseInt($page.params["weekday"])])}: Редактирование
</h1>

<form method="post" bind:this={formEl} use:enhance>
    <datalist id="subjects">
        {#each data.subjects as subject}
            <option value={subject.name} />
        {/each}
    </datalist>

    <input
        on:change={updateTime}
        name="offset"
        type="time"
        value={numberToTime($form.offset)}
        required
    />
    <input
        name="subjectLength"
        type="number"
        placeholder="Длина предметов"
        bind:value={$form.subjectLength}
        {...$constraints.subjectLength}
    />
    <input
        name="subjectBreak"
        type="number"
        placeholder="Перемены предметов"
        bind:value={$form.subjectBreak}
        {...$constraints.subjectBreak}
    />

    <ul>
        {#each $form.subjects as _, i}
            <li>
                <input
                    placeholder="Название предмета"
                    type="text"
                    list="subjects"
                    on:change={() => updateSubject(i)}
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
                    class="teacher"
                    type="text"
                    bind:value={$form.subjects[i].teacher}
                    {...$constraints.subjects?.teacher}
                />
                <input
                    placeholder="Класс"
                    type="text"
                    class="classroom"
                    bind:value={$form.subjects[i].classroom}
                    {...$constraints.subjects?.classroom}
                />
                <input
                    placeholder="Позиция"
                    type="number"
                    bind:value={$form.subjects[i].position}
                    {...$constraints.subjects?.position}
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

    <MainButton onClick={submitForm} text="СОХРАНИТЬ" />
</form>
