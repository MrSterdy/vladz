<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";

    interface $$Props {
        newPage: string;
    }

    export let newPage: string;

    const callback = () => goto(newPage);

    onMount(() => {
        window.Telegram.WebApp.BackButton.onClick(callback);
        window.Telegram.WebApp.BackButton.show();
    });

    onDestroy(() => {
        if (browser) {
            window.Telegram.WebApp.BackButton.offClick(callback);
            window.Telegram.WebApp.BackButton.hide();
        }
    });
</script>
