<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";

    interface $$Props {
        message: string;
        icon: "sad" | "beach";
    }

    export let message: string;
    export let icon: "sad" | "beach";
</script>

<div class="self-center flex flex-col items-center">
    <Icon name={icon} class="h-24 w-24 fill-base-content" />
    <p class="text-lg text-base-content">{message}</p>
</div>
