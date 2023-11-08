import { Telegraf } from "telegraf";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import xl from "excel4node";

import { TELEGRAM_BOT_TOKEN } from "$env/static/private";
import { getAllGroups } from "$lib/server/services/groupService";

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
bot.command("start", ctx =>
    ctx.reply("🌠 | Нажмите на кнопку рядом с чатом, чтобы начать пользоваться ботом. Также подпишитесь на наш канал, чтобы быть в курсе новых событий: t.me/vladz_chan")
);
bot.command("excel", async ctx => {
    const groups = await getAllGroups();

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet("Группы // VDZ");

    ws.column(1).setWidth(20);
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(30);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(20);
    ws.column(6).setWidth(20);

    ws.cell(1, 1).string("Группа");
    ws.cell(1, 2).string("Код группы");
    ws.cell(1, 3).string("Староста");
    ws.cell(1, 4).string("Кол-во дисциплин");
    ws.cell(1, 5).string("Кол-во расписаний");
    ws.cell(1, 6).string("Кол-во участников");

    for (const [index, group] of groups.entries()) {
        const row = index + 2;

        const monitor = group.users.find(u => u.role === "MONITOR");

        ws.cell(row, 1).string(group.name);
        ws.cell(row, 2).string(group.inviteCode);
        ws.cell(row, 3).string(monitor ? `${monitor.user.lastName} ${monitor.user.firstName}` : "");
        ws.cell(row, 4).number(group.subjects.length);
        ws.cell(row, 5).number(group.weekdayTimetables.length);
        ws.cell(row, 6).number(group.users.length);
    }

    await ctx.replyWithDocument({ source: await wb.writeToBuffer(), filename: "excel.xlsx" });
});

export default bot;
