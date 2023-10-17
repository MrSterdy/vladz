import * as crypto from "crypto";

import { TELEGRAM_BOT_TOKEN } from "$env/static/private";
import type { TelegramUser } from "$lib/types";
import jwt from "jsonwebtoken";

const secret = crypto
    .createHmac("sha256", "WebAppData")
    .update(TELEGRAM_BOT_TOKEN)
    .digest();

export function decodeInitData(initData: string) {
    const decoded = decodeURIComponent(initData);

    const arr = decoded.split("&");

    const hashIndex = arr.findIndex(str => str.startsWith("hash="));
    if (hashIndex === -1) {
        return null;
    }
    const hashExpected = arr.splice(hashIndex)[0].split("=")[1];

    arr.sort((a, b) => a.localeCompare(b));

    const dataCheckString = arr.join("\n");

    const hashResult = crypto
        .createHmac("sha256", secret)
        .update(dataCheckString)
        .digest("hex");

    if (hashExpected !== hashResult) {
        return null;
    }

    const userIndex = arr.findIndex(str => str.startsWith("user="));

    return JSON.parse(
        arr[userIndex].split("=")[1]
    ) as TelegramWebApp["initDataUnsafe"]["user"];
}

export function generateJwt(user: TelegramUser) {
    const userInfo = {
        userInfo: JSON.stringify(user, (_, v) =>
            typeof v === "bigint" ? v.toString() : v
        )
    };

    return jwt.sign(userInfo, TELEGRAM_BOT_TOKEN, { expiresIn: "1d" });
}

export function parseJwt(token: string) {
    try {
        const payload = jwt.verify(token, TELEGRAM_BOT_TOKEN) as {
            userInfo: string;
        };
        const user = JSON.parse(payload.userInfo) as TelegramUser;
        user.id = BigInt(user.id);

        return user;
    } catch (e) {
        return null;
    }
}
