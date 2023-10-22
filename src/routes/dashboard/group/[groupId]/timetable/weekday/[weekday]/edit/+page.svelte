<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";

    import type { PageData } from "./$types";

    import BackButton from "$lib/components/BackButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import MainButton from "$lib/components/MainButton.svelte";
    import { handleError, handleUpdated } from "$lib/utils/form";
    import { numberToTime, timeToNumber } from "$lib/utils/time";

    export let data: PageData;

    const { form, enhance, constraints } = superForm(data.form, {
        dataType: "json",
        onUpdated: handleUpdated,
        onError: handleError,
        taintedMessage:
            "Вы действительно хотите покинуть страницу? Изменения, cделанные вами, не сохранятся"
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

    function moveUp(subjectIndex: number) {
        const subjectPosition = $form.subjects[subjectIndex].position;
        const upperSubjectIndex = $form.subjects.findIndex(
            s => s.position === subjectPosition + 1
        );
        $form.subjects[subjectIndex].position = subjectPosition + 1;
        $form.subjects[upperSubjectIndex].position = subjectPosition;
    }

    function moveDown(subjectIndex: number) {
        const subjectPosition = $form.subjects[subjectIndex].position;
        const lowerSubjectIndex = $form.subjects.findIndex(
            s => s.position === subjectPosition - 1
        );
        $form.subjects[subjectIndex].position = subjectPosition - 1;
        $form.subjects[lowerSubjectIndex].position = subjectPosition;
    }
</script>

<BackButton newPage="../" />

<form class="flex flex-col gap-2" method="post" bind:this={formEl} use:enhance>
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
            <label class="label" for="subject-length">
                <span class="label-text">Длина урока</span>
            </label>
            <input
                id="subject-length"
                name="subjectLength"
                type="number"
                class="w-full input input-primary input-bordered"
                bind:value={$form.subjectLength}
                {...$constraints.subjectLength}
            />
        </div>
        <div class="w-full">
            <label class="label" for="subject-break">
                <span class="label-text">Длина перемены</span>
            </label>
            <input
                id="subject-break"
                name="subjectBreak"
                type="number"
                class="w-full input input-primary input-bordered"
                bind:value={$form.subjectBreak}
                {...$constraints.subjectBreak}
            />
        </div>
    </div>

    {#if $form.subjects.length}
        {@const positions = $form.subjects.map(s => s.position).sort()}
        {@const [minPos, maxPos] = [
            positions[0],
            positions[positions.length - 1]
        ]}
        <div class="join join-vertical word-break w-full">
            {#each $form.subjects.sort((a, b) => a.position - b.position) as subject, i}
                <div
                    class="collapse collapse-arrow join-item border bg-base-100 rounded-box"
                >
                    <input type="radio" name="accordion-subjects" />
                    <div class="collapse-title">
                        {subject.position}.
                        <span
                            class="text-xl font-medium"
                            class:text-neutral-content={!subject.name}
                            >{subject.name || "[Пусто]"}</span
                        >

                        {#if (subject.position >= minPos && subject.position < maxPos) || (subject.position > minPos && subject.position <= maxPos)}
                            <div class="flex items-center">
                                {#if subject.position >= minPos && subject.position < maxPos}
                                    <button
                                        class="z-10"
                                        type="button"
                                        on:click={() => moveUp(i)}
                                    >
                                        <Icon
                                            name="demote"
                                            class="icon-medium fill-base-content"
                                        />
                                    </button>
                                {/if}
                                {#if subject.position > minPos && subject.position <= maxPos}
                                    <button
                                        class="z-10"
                                        type="button"
                                        on:click={() => moveDown(i)}
                                    >
                                        <Icon
                                            name="promote"
                                            class="icon-medium fill-base-content"
                                        />
                                    </button>
                                {/if}
                            </div>
                        {/if}
                    </div>
                    <div class="collapse-content">
                        <div class="w-full">
                            <label for="name-{i}" class="label">
                                <span class="label-text">Название</span>
                            </label>

                            <input
                                id="name-{i}"
                                type="text"
                                list="subjects"
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
                                    placeholder="Перемена"
                                    type="number"
                                    bind:value={$form.subjects[i].break}
                                    {...$constraints.subjects?.break}
                                />
                            </div>
                        </div>
                        <div class="w-full">
                            <label for="teacher-{i}" class="label">
                                <span class="label-text">Преподаватель</span>
                            </label>

                            <input
                                id="teacher-{i}"
                                placeholder="Преподаватель"
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
                                class="w-full input input-secondary input-bordered"
                                type="text"
                                bind:value={$form.subjects[i].classroom}
                                {...$constraints.subjects?.classroom}
                            />
                        </div>
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

    {#if $form.subjects.length < 32}
        <button type="button" class="btn btn-primary" on:click={addSubject}
            >Добавить предмет</button
        >
    {/if}

    <MainButton onClick={submitForm} text="СОХРАНИТЬ" />
</form>
