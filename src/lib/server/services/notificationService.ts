import prisma from "$lib/server/db/prisma";
import bot from "$lib/server/bot";
import type { Dayjs } from "dayjs";

export async function sendPromotionNotification(
    userId: bigint,
    newRole: string,
    groupName?: string
) {
    let notification = `⚡️ | Ваша роль изменена на "${newRole}"`;
    if (groupName) {
        notification += ` в группе "${groupName}"`;
    }

    await bot.telegram.sendMessage(userId.toString(), notification);
}

export async function sendApplicationStateNotification(
    userId: bigint,
    state: "sent" | "accepted" | "denied",
    groupName: string
) {
    let notification = `⚡️ | Ваша заявка в группу "${groupName}" была `;
    notification +=
        state === "sent"
            ? "отправлена"
            : state === "accepted"
            ? "принята"
            : "отклонена";

    await bot.telegram.sendMessage(userId.toString(), notification);
}

export async function sendKickNotification(userId: bigint, groupName: string) {
    const notification = `⚡️ | Вы были исключены из группы "${groupName}"`;

    await bot.telegram.sendMessage(userId.toString(), notification);
}

export async function sendApplicationNotifications(
    groupId: number,
    groupName: string
) {
    const users = await prisma.userGroup.findMany({
        select: {
            userId: true
        },
        where: {
            groupId,
            role: "CURATOR"
        }
    });

    await Promise.all(
        users.map(u =>
            bot.telegram.sendMessage(
                u.userId.toString(),
                `⚡️ | Новая заявка в группе "${groupName}"`
            )
        )
    );
}

export async function sendTimetableNotifications(
    groupId: number,
    groupName: string,
    date: Dayjs
) {
    const users = await prisma.userSettings.findMany({
        select: {
            userId: true
        },
        where: {
            settings: {
                path: ["notifications", "timetable"],
                equals: true
            },
            user: {
                userGroups: {
                    some: {
                        groupId
                    }
                }
            }
        }
    });

    await Promise.all(
        users.map(u =>
            bot.telegram.sendMessage(
                u.userId.toString(),
                `⚡️ | Произошли изменения в расписании в группе "${groupName}" на ${date.format(
                    "DD.MM.YYYY"
                )}`
            )
        )
    );
}
