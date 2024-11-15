import type { Dayjs } from "dayjs";

import bot from "$lib/server/bot";
import prisma from "$lib/server/db/prisma";

export async function sendPromotionNotification(
    userId: bigint,
    newRole: string,
    groupName?: string
) {
    let notification = `⚡️ | Ваша роль изменена на "${newRole}"`;
    if (groupName) {
        notification += ` в группе "${groupName}"`;
    }

    await bot.telegram
        .sendMessage(userId.toString(), notification)
        .catch(() =>
            console.error(`Couldn't send message to ${userId.toString()}`)
        );
}

export async function sendApplicationStateNotification(
    userId: bigint,
    state: "accepted" | "denied",
    groupName: string
) {
    let notification = `⚡️ | Ваша заявка в группу "${groupName}" была `;
    notification += state === "accepted" ? "принята" : "отклонена";

    await bot.telegram
        .sendMessage(userId.toString(), notification)
        .catch(() =>
            console.error(`Couldn't send message to ${userId.toString()}`)
        );
}

export async function sendKickNotification(userId: bigint, groupName: string) {
    const notification = `⚡️ | Вы были исключены из группы "${groupName}"`;

    await bot.telegram
        .sendMessage(userId.toString(), notification)
        .catch(() =>
            console.error(`Couldn't send message to ${userId.toString()}`)
        );
}

export async function sendApplicationNotifications(
    groupId: number,
    groupName: string
) {
    const users = await prisma.user.findMany({
        select: {
            id: true
        },
        where: {
            groups: {
                some: {
                    groupId,
                    OR: [
                        {
                            role: "CURATOR"
                        },
                        {
                            role: "MONITOR"
                        }
                    ]
                }
            },
            settings: {
                path: ["notifications", "application_new"],
                equals: true
            }
        }
    });

    await Promise.all(
        users.map(u =>
            bot.telegram
                .sendMessage(
                    u.id.toString(),
                    `⚡️ | Новая заявка в группе "${groupName}"`
                )
                .catch(() =>
                    console.error(`Couldn't send message to ${u.id.toString()}`)
                )
        )
    );
}

export async function sendTimetableNotifications(
    groupId: number,
    groupName: string,
    date: Dayjs
) {
    const users = await prisma.user.findMany({
        select: {
            id: true
        },
        where: {
            settings: {
                path: ["notifications", "timetable"],
                equals: true
            },
            groups: {
                some: {
                    groupId
                }
            }
        }
    });

    await Promise.all(
        users.map(u =>
            bot.telegram
                .sendMessage(
                    u.id.toString(),
                    `⚡️ | Произошли изменения в расписании в группе "${groupName}" на ${date.format(
                        "DD.MM.YYYY"
                    )}`
                )
                .catch(() =>
                    console.error(`Couldn't send message to ${u.id.toString()}`)
                )
        )
    );
}
