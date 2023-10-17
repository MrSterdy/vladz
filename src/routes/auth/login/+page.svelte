<script lang="ts">
    import { onMount } from "svelte";

    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import { REDIRECT_PARAM_NAME } from "$lib/consts";

    let error = false;

    onMount(async () => {
        try {
            const result = await fetch("/api/user/telegram", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    initData: window.Telegram.WebApp.initData
                })
            });

            if (!result.ok) {
                error = true;
            } else {
                await goto(
                    $page.url.searchParams.get(REDIRECT_PARAM_NAME) ?? "/"
                );
            }
        } catch (e) {
            error = true;
        }
    });
</script>

{#if error}
    <h1 class="text-center text-error">Ошибка входа</h1>
{:else}
    <div class="grid place-items-center">
        <span class="loading loading-spinner loading-lg" />
    </div>
{/if}
