<script>
    import Icon from "$lib/components/Icon.svelte";
</script>

<div class="w-full text-center">
    <h1 class="font-bold">
        Узнавайте <span class="text-primary">расписания</span> за секунды.
    </h1>

    <p class="text-lg">
        Владз позволяет вам просматривать домашние задания и расписания на любой
        день. Просто войдите в свою группу и начните пользоваться прямо сейчас.
    </p>

    <div class="flex flex-col gap-2 w-1/2 justify-center mx-auto">
        <a href="/dashboard/groups" role="button" class="btn btn-primary">
            <Icon name="arrow" class="fill-primary-content icon-medium " />
            Мои группы
        </a>

        <button class="btn btn-neutral" on:click={() => window.Telegram.WebApp.openLink("https://github.com/MrSterdy/vladz")}>
            <Icon name="github" class="fill-neutral-content icon-medium" />
            GitHub
        </button>
    </div>
</div>
