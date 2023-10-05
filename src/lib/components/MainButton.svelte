<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    interface $$Props {
        onClick: () => void;
        text: string;
    }

    export let onClick: () => Promise<void> | void;
    export let text: string;

    const callback = async () => {
        window.Telegram.WebApp.MainButton.showProgress(false);
        await onClick();
        window.Telegram.WebApp.MainButton.hideProgress();
    }

    onMount(() => {
        window.Telegram.WebApp.MainButton.setText(text);
        window.Telegram.WebApp.MainButton.onClick(callback);
        window.Telegram.WebApp.MainButton.show();
    });

    onDestroy(() => {
        window.Telegram.WebApp.MainButton.offClick(callback);
        window.Telegram.WebApp.MainButton.hide();
    });
</script>
