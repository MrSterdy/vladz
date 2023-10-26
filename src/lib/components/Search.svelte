<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
</script>

<form class="flex gap-2">
    <input
        type="text"
        name="search"
        class="w-full input input-primary input-bordered"
        placeholder="Поиск"
    />

    <button type="submit" class="btn btn-primary">
        <Icon name="search" class="fill-primary-content icon-medium" />
    </button>
</form>
