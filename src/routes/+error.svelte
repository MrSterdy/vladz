<script lang="ts">
    import { page } from "$app/stores";
    import BackButton from "$lib/components/BackButton.svelte";
</script>

<BackButton newPage="/" />

<h1 class="text-center break-all text-error">{$page.error?.message}</h1>
