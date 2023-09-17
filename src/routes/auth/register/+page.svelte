<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";

    export let data: PageData;

    const { form, errors, constraints, enhance } = superForm(data.form);
</script>

<form method="post" use:enhance>
    <input
        name="first_name"
        aria-invalid={$errors.first_name ? "true" : undefined}
        type="text"
        placeholder="Имя"
        bind:value={$form.first_name}
        {...$constraints.first_name}
    />

    <input
        name="last_name"
        aria-invalid={$errors.last_name ? "true" : undefined}
        type="text"
        placeholder="Фамилия"
        bind:value={$form.last_name}
        {...$constraints.last_name}
    />

    <input type="submit" />
</form>
