<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import { formatISOString } from "$lib/utils";

    export let data: PageData;

    const { form, constraints, enhance } = superForm(data.form, {
        dataType: "json"
    });

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

    <input type="submit" value="Сохранить" />
    <button type="button" on:click={addHoliday}>Создать выходной</button>
</form>
