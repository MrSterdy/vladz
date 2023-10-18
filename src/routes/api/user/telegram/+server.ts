import { json, error, type RequestEvent } from "@sveltejs/kit";

import { ADMIN_ID } from "$env/static/private";

import { AUTH_TELEGRAM_COOKIE_NAME } from "$lib/consts";
import {
    decodeInitData,
    generateJwt
} from "$lib/server/services/telegramService";
import type { TelegramUser } from "$lib/types";

export async function POST(event: RequestEvent) {
    let telegramInfo: TelegramUser | null = null;

    if (import.meta.env.DEV) {
        telegramInfo = {
            id: BigInt(ADMIN_ID),
            first_name: "Влад",
            last_name: "Король",
            username: "vlad"
        };
    } else {
        const rawInitData = (await event.request.json()) as {
            initData?: string;
        } | null;
        if (!rawInitData || !rawInitData.initData) {
            throw error(400, { message: "Invalid initData" });
        }

        telegramInfo = decodeInitData(rawInitData.initData);
    }

    if (!telegramInfo) {
        throw error(400, { message: "Invalid initData" });
    }

    event.cookies.set(AUTH_TELEGRAM_COOKIE_NAME, generateJwt(telegramInfo), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        domain: event.url.hostname
    });

    return json({ message: "ok" });
}
