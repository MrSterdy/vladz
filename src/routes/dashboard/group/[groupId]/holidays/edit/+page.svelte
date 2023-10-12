<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import { formatISOString } from "$lib/utils/time";
    import MainButton from "$lib/components/MainButton.svelte";

    export let data: PageData;

    const { form, constraints, enhance } = superForm(data.form, {
        dataType: "json"
    });

    let formEl: HTMLFormElement;

    const submitForm = () => formEl.requestSubmit();

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

<form method="post" bind:this={formEl} use:enhance>
    <ul class="m-0 p-0 list-none">
        {#each $form.holidays as _, i}
            <li class="card card-compact card-body bg-base-100 w-full">
                <input
                    class="input input-primary input-bordered w-full"
                    type="date"
                    bind:value={$form.holidays[i].startDate}
                    {...$constraints.holidays?.startDate}
                />

                <div class="divider m-0">ПО</div>

                <input
                    class="input input-primary input-bordered w-full"
                    type="date"
                    bind:value={$form.holidays[i].endDate}
                    {...$constraints.holidays?.endDate}
                />

                <button
                    type="button"
                    class="btn btn-error"
                    on:click={() => removeHoliday(i)}
                >
                    Удалить
                </button>
            </li>
        {/each}
    </ul>

    <button type="button" class="btn btn-primary w-full" on:click={addHoliday}
        >Создать выходной</button
    >

    <MainButton onClick={submitForm} text="СОХРАНИТЬ" />
</form>
