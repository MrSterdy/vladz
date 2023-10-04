import { json, error, type RequestEvent } from "@sveltejs/kit";

import {
    decodeInitData,
    generateJwt
} from "$lib/server/services/telegramService";
import { AUTH_TELEGRAM_COOKIE_NAME } from "$lib/consts";

export async function POST(event: RequestEvent) {
    const rawInitData = (await event.request.json()) as {
        initData?: string;
    } | null;
    if (!rawInitData || !rawInitData.initData) {
        throw error(400, { message: "Invalid initData" });
    }

    const telegramInfo = decodeInitData(rawInitData.initData);
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
