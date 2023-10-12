<script lang="ts">
    import { page } from "$app/stores";
    import { browser } from "$app/environment";

    import "../app.css";
    import { onMount } from "svelte";
    import Navbar from "$lib/components/Navbar.svelte";

    let onMainPage = true;

    $: if (browser && $page.url.pathname === "/") {
        window.Telegram.WebApp.BackButton.hide();
        onMainPage = true;
    } else if (browser) {
        window.Telegram.WebApp.BackButton.show();
        onMainPage = false;
    }

    onMount(() => {
        document.documentElement.setAttribute(
            "data-theme",
            window.Telegram.WebApp.colorScheme
        );
    });
</script>

<main
    class="flex flex-col h-full gap-4 {onMainPage ? 'bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] to-base-100 from-primary' : ''} "
>
    <Navbar transparent={onMainPage} />

    <article class="prose p-4 h-full max-w-full">
        <slot />
    </article>
</main>

<style lang="postcss">
    :global([data-theme=dark]) article {
        @apply prose-invert;
    }
</style>
