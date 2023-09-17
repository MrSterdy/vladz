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
                    initData: window.Telegram.WebApp.initData,
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
    <h1>Ошибка входа</h1>
{:else}
    <h1>Вход...</h1>
{/if}
