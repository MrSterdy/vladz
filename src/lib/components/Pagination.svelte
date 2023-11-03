<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import { pageSize } from "$lib/consts";

    interface $$Props {
        currentPage: number;
        totalItems: number;
    }

    export let currentPage: number;
    export let totalItems: number;

    $: totalPages = Math.ceil(totalItems / pageSize);

    function prevPage() {
        const query = new URLSearchParams($page.url.searchParams.toString());
        query.set(
            "page",
            (
                (parseInt($page.url.searchParams.get("page") || "2") || 2) - 1
            ).toString()
        );
        goto(`?${query.toString()}`);
    }

    function nextPage() {
        const query = new URLSearchParams($page.url.searchParams.toString());
        query.set(
            "page",
            (
                (parseInt($page.url.searchParams.get("page") || "1") || 1) + 1
            ).toString()
        );
        goto(`?${query.toString()}`);
    }
</script>

{#if totalPages > 1}
    <div class="join self-center">
        {#if currentPage > 1}
            <button class="join-item btn text-lg" on:click={prevPage}>«</button>
        {/if}
        <button class="join-item btn text-lg">{currentPage}</button>
        {#if totalPages > currentPage}
            <button class="join-item btn text-lg" on:click={nextPage}>»</button>
        {/if}
    </div>
{/if}
