<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";

    import type { PageData } from "./$types";

    import { numberToTime, timeToNumber } from "$lib/utils/time";

    import MainButton from "$lib/components/MainButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import { handleError, handleUpdated } from "$lib/utils/form";

    export let data: PageData;

    const { form, enhance, constraints, errors } = superForm(data.form, {
        dataType: "json",
        onUpdated: handleUpdated,
        onError: handleError
    });

    let formEl: HTMLFormElement;

    function updateTime(this: HTMLInputElement) {
        $form.offset = timeToNumber(this.value);
    }

    function addSubject() {
        $form.subjects = [
            ...$form.subjects,
            {
                name: "",
                length: data.weekdayTimetable?.subjectLength ?? 0,
                break: data.weekdayTimetable?.subjectBreak ?? 0,
                classroom: null,
                teacher: null,
                position: $form.subjects.length
                    ? Math.max(
                          ...$form.subjects.map(subject => subject.position)
                      ) + 1
                    : 1,
                homeworkText: null,
                homeworkFiles: null
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

    function removeHomeworkFile(index: number, fileName: string) {
        const files = $form.subjects[index]!.homeworkFiles;
        const subjectIndex = files?.findIndex(x => x.name === fileName);
        $form.subjects[index]!.homeworkFiles =
            files?.filter((_, i) => i !== subjectIndex) ?? null;
    }
</script>

<form
    class="flex flex-col gap-2"
    method="post"
    enctype="multipart/form-data"
    bind:this={formEl}
    use:enhance
>
    <datalist id="subjects">
        {#each data.subjects as subject}
            <option value={subject.name} />
        {/each}
    </datalist>

    <div class="w-full">
        <div class="w-full">
            <label class="label" for="offset">
                <span class="label-text">Начало занятий</span>
            </label>
            <input
                id="offset"
                on:change={updateTime}
                name="offset"
                type="time"
                class="w-full input input-primary input-bordered"
                value={numberToTime($form.offset)}
                required
            />
        </div>
        <div class="w-full">
            <label class="label" for="note">
                <span class="label-text">Примечание</span>
            </label>
            <input
                id="note"
                name="note"
                type="text"
                aria-invalid={$errors.note ? true : undefined}
                class="w-full input input-secondary input-bordered"
                placeholder="Примечание"
                bind:value={$form.note}
                {...$constraints.note}
            />
        </div>
    </div>

    {#if $form.subjects.length}
        <div class="join join-vertical w-full">
            {#each $form.subjects as subject, i}
                <div
                    class="collapse collapse-arrow join-item border bg-base-100"
                >
                    <input type="radio" name="accordion-subjects" />
                    <div class="collapse-title">
                        {subject.position}.
                        <span
                            class="text-xl font-medium"
                            class:text-neutral-content={!subject.name}
                            >{subject.name || "[Пусто]"}</span
                        >
                    </div>
                    <div class="collapse-content">
                        <div class="w-full">
                            <label for="name-{i}" class="label">
                                <span class="label-text">Название</span>
                            </label>

                            <input
                                id="name-{i}"
                                type="text"
                                aria-invalid={$errors.subjects?.[i].name
                                    ? true
                                    : undefined}
                                placeholder="Название"
                                on:change={() => updateSubject(i)}
                                class="w-full input input-bordered input-primary"
                                bind:value={$form.subjects[i].name}
                                {...$constraints.subjects?.name}
                            />
                        </div>
                        <div class="w-full flex gap-4">
                            <div class="grow">
                                <label for="length-{i}" class="label">
                                    <span class="label-text">Длина</span>
                                </label>

                                <input
                                    id="length-{i}"
                                    class="w-full input input-primary input-bordered"
                                    aria-invalid={$errors.subjects?.[i].length
                                        ? true
                                        : undefined}
                                    placeholder="Длина"
                                    type="number"
                                    bind:value={$form.subjects[i].length}
                                    {...$constraints.subjects?.length}
                                />
                            </div>
                            <div class="grow">
                                <label for="break-{i}" class="label">
                                    <span class="label-text">Перемена</span>
                                </label>

                                <input
                                    id="break-{i}"
                                    class="w-full input input-primary input-bordered"
                                    aria-invalid={$errors.subjects?.[i].break
                                        ? true
                                        : undefined}
                                    placeholder="Перемена"
                                    type="number"
                                    bind:value={$form.subjects[i].break}
                                    {...$constraints.subjects?.break}
                                />
                            </div>
                        </div>
                        <div class="w-full">
                            <label for="teacher-{i}" class="label">
                                <span class="label-text">Учитель</span>
                            </label>

                            <input
                                id="teacher-{i}"
                                placeholder="Учитель"
                                aria-invalid={$errors.subjects?.[i].teacher
                                    ? true
                                    : undefined}
                                class="w-full input input-bordered input-secondary"
                                type="text"
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
                                placeholder="Кабинет"
                                aria-invalid={$errors.subjects?.[i].classroom
                                    ? true
                                    : undefined}
                                class="w-full input input-secondary input-bordered"
                                type="text"
                                bind:value={$form.subjects[i].classroom}
                                {...$constraints.subjects?.classroom}
                            />
                        </div>
                        {#if subject.name}
                            <div class="w-full flex flex-col gap-2">
                                <div class="w-full">
                                    <label
                                        for="homework-text-{i}"
                                        class="label"
                                    >
                                        <span class="label-text"
                                            >Домашнее задание</span
                                        >
                                    </label>

                                    <input
                                        id="homework-text-{i}"
                                        type="text"
                                        placeholder="Текст"
                                        aria-invalid={$errors.subjects?.[i]
                                            .homeworkText
                                            ? true
                                            : undefined}
                                        class="w-full input input-secondary input-bordered"
                                        bind:value={$form.subjects[i]
                                            .homeworkText}
                                        {...$constraints.subjects?.homeworkText}
                                    />
                                </div>
                                <input
                                    name="files-{subject.position}"
                                    type="file"
                                    multiple
                                    class="w-full file-input file-input-secondary file-input-bordered"
                                />
                                {#if subject.homeworkFiles?.length}
                                    <div
                                        class="w-full bg-base-200 flex p-4 gap-4 flex-wrap break-all"
                                    >
                                        {#each subject.homeworkFiles as file}
                                            <button
                                                on:click={() =>
                                                    removeHomeworkFile(
                                                        i,
                                                        file.name
                                                    )}
                                                type="button"
                                                class="flex gap-2 items-center"
                                            >
                                                <Icon
                                                    name="cross"
                                                    class="icon-small fill-error shrink-0"
                                                />
                                                {file.name}
                                            </button>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        {/if}
                        <button
                            type="button"
                            class="btn btn-error w-full mt-2"
                            on:click={() => removeSubject(subject.position)}
                            >Удалить</button
                        >
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    <button type="button" class="btn btn-primary" on:click={addSubject}
        >Добавить предмет</button
    >

    <MainButton onClick={() => formEl.requestSubmit()} text="СОХРАНИТЬ" />
</form>
