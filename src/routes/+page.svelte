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

    <div class="flex flex-col gap-2 max-w-xs mx-auto">
        <a href="/dashboard/groups" role="button" class="btn btn-primary">
            <Icon name="arrow" class="fill-primary-content icon-medium " />
            Мои группы
        </a>

        <button
            class="btn btn-neutral"
            on:click={() =>
                window.Telegram.WebApp.openLink(
                    "https://github.com/MrSterdy/vladz"
                )}
        >
            <Icon name="github" class="fill-neutral-content icon-medium" />
            GitHub
        </button>

        <button
            class="btn btn-ghost text-neutral"
            id="donate"
            on:click={() =>
                window.Telegram.WebApp.openLink(
                    "https://donate.qiwi.com/payin/MrSterdy"
                )}
        >
            <Icon name="coins" class="fill-neutral icon-medium" />
            Поддержать
        </button>
    </div>
</div>

<style lang="postcss">
    #donate {
        background: linear-gradient(90deg, #fcd34d, #f59e0b, #fcd34d);
        background-size: 400%;
        animation: glowing 20s linear infinite;
        transition: opacity 0.3s ease-in-out;
        box-shadow: 0 0 30px 10px rgba(255, 253, 221, 0.25);
    }
    @keyframes glowing {
        0% {
            background-position: 0 0;
        }
        50% {
            background-position: 400% 0;
        }
        100% {
            background-position: 0 0;
        }
    }
</style>
