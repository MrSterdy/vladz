import * as crypto from "crypto";
import jwt from "jsonwebtoken";

import { TELEGRAM_BOT_TOKEN } from "$env/static/private";

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

    return (JSON.parse(arr[userIndex].split("=")[1]) as { id: bigint }).id;
}

export function generateJwt(telegramId: bigint) {
    return jwt.sign({ telegramId: telegramId.toString() }, TELEGRAM_BOT_TOKEN, {
        expiresIn: "1d"
    });
}

export function parseJwt(token: string) {
    try {
        const payload = jwt.verify(token, TELEGRAM_BOT_TOKEN) as {
            telegramId: string;
        };

        return BigInt(payload.telegramId);
    } catch (e) {
        return null;
    }
}
