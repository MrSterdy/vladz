<script lang="ts">
    import "../app.css";
    import { SvelteToast } from "@zerodevx/svelte-toast";
    import { onMount } from "svelte";
    import { getFlash } from "sveltekit-flash-message";

    import { browser } from "$app/environment";
    import { page } from "$app/stores";

    import Navbar from "$lib/components/Navbar.svelte";
    import { showToastError, showToastSuccess } from "$lib/utils/toast";

    let onMainPage = true;

    $: if (browser && $page.url.pathname === "/") {
        window.Telegram.WebApp.BackButton.hide();
        onMainPage = true;
    } else if (browser) {
        window.Telegram.WebApp.BackButton.show();
        onMainPage = false;
    }

    const flash = getFlash(page);
    flash.subscribe(flashResult => {
        if (!flashResult) return;

        (flashResult.type === "success" ? showToastSuccess : showToastError)(
            flashResult.message
        );

        flash.set(undefined);
    });

    onMount(() => {
        document.documentElement.setAttribute(
            "data-theme",
            window.Telegram.WebApp.colorScheme
        );
    });
</script>

<div class="toast-wrapper">
    <SvelteToast
        options={{ reversed: true, intro: { y: 192 }, dismissable: false }}
    />
</div>

<main
    class="flex flex-col min-h-full grow w-full {onMainPage
        ? 'bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] to-base-100 from-primary'
        : ''} "
>
    <Navbar transparent={onMainPage} />

    <article class="prose p-4 h-full max-w-full">
        <slot />
    </article>
</main>

<style lang="postcss">
    :global([data-theme="dark"]) article {
        @apply prose-invert;
    }
</style>
