import { json, error, type RequestEvent } from "@sveltejs/kit";

import { ADMIN_ID } from "$env/static/private";

import { AUTH_TELEGRAM_COOKIE_NAME } from "$lib/consts";
import {
    decodeInitData,
    generateJwt
} from "$lib/server/services/telegramService";

export async function POST(event: RequestEvent) {
    let telegramId: bigint | null = null;

    if (import.meta.env.DEV) {
        telegramId = BigInt(ADMIN_ID);
    } else {
        const rawInitData = (await event.request.json()) as {
            initData?: string;
        } | null;
        if (!rawInitData || !rawInitData.initData) {
            throw error(400, { message: "Invalid initData" });
        }

        telegramId = decodeInitData(rawInitData.initData);
    }

    if (!telegramId) {
        throw error(400, { message: "Invalid initData" });
    }

    event.cookies.set(AUTH_TELEGRAM_COOKIE_NAME, generateJwt(telegramId), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        domain: event.url.hostname
    });

    return json({ message: "ok" });
}
