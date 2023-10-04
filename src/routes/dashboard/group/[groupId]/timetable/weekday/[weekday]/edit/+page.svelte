<script lang="ts">
    import type { PageData } from "./$types";
    import { capitalize, numberToTime, timeToNumber } from "$lib/utils";
    import { page } from "$app/stores";
    import { superForm } from "sveltekit-superforms/client";
    import { weekdays } from "$lib/consts";

    export let data: PageData;

    const { form, enhance, constraints } = superForm(data.form, {
        dataType: "json"
    });

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
</script>

<h1>
    {capitalize(weekdays[parseInt($page.params["weekday"])])}: Редактирование
</h1>

<form method="post" use:enhance>
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

    <input type="submit" value="Сохранить" />
</form>
