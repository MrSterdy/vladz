import { Telegraf } from "telegraf";

import { TELEGRAM_BOT_TOKEN } from "$env/static/private";

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
bot.command("start", ctx =>
    ctx.reply("🌠 | Нажмите на кнопку рядом с чатом, чтобы начать пользоваться")
);

export default bot;
