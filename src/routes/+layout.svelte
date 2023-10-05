<script lang="ts">
    import { page } from "$app/stores";
    import { browser } from "$app/environment";

    import "../app.css";

    $: if (browser && $page.url.pathname === "/") {
        window.Telegram.WebApp.BackButton.hide();
    } else if (browser) {
        window.Telegram.WebApp.BackButton.show();
    }
</script>

<section class="prose">
    <slot />
</section>
