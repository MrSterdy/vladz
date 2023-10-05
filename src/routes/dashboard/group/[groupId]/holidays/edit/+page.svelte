<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import { formatISOString } from "$lib/utils";
    import MainButton from "$lib/components/MainButton.svelte";

    export let data: PageData;

    const { form, constraints, enhance } = superForm(data.form, {
        dataType: "json"
    });

    let inputEl: HTMLInputElement;

    const submitForm = () => inputEl.click();

    function addHoliday() {
        const today = formatISOString(new Date());

        $form.holidays = [
            ...$form.holidays,
            { startDate: today, endDate: today }
        ];
    }

    function removeHoliday(index: number) {
        $form.holidays = $form.holidays.filter((_, i) => i !== index);
    }
</script>

<h1>Редактирование выходных</h1>

<form method="post" use:enhance>
    <ul>
        {#each $form.holidays as _, i}
            <li>
                <input
                    type="date"
                    bind:value={$form.holidays[i].startDate}
                    {...$constraints.holidays?.startDate}
                />
                <input
                    type="date"
                    bind:value={$form.holidays[i].endDate}
                    {...$constraints.holidays?.endDate}
                />

                <button type="button" on:click={() => removeHoliday(i)}>
                    Удалить
                </button>
            </li>
        {/each}
    </ul>

    <button type="button" on:click={addHoliday}>Создать выходной</button>

    <input type="submit" bind:this={inputEl} class="hidden" />
    <MainButton onClick={submitForm} text="СОХРАНИТЬ" />
</form>
