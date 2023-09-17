import { redirect, type Handle } from "@sveltejs/kit";

import {
    AUTH_ACCESS_COOKIE_NAME,
    AUTH_REFRESH_COOKIE_NAME,
    AUTH_TELEGRAM_COOKIE_NAME,
    REDIRECT_PARAM_NAME
} from "$lib/consts";
import * as telegramService from "$lib/server/services/telegramService";
import * as userService from "$lib/server/services/userService";
import type { TelegramUser, User } from "$lib/types";
import { createUser, updateUser } from "$lib/server/services/userService";
import { ADMIN_ID } from "$env/static/private";

export const handle: Handle = async ({ event, resolve }) => {
    if (
        event.url.pathname.startsWith("/login") ||
        event.url.pathname.startsWith("/api")
    ) {
        return resolve(event);
    }

    let user: User | null = null;
    let telegramUser: TelegramUser | null = null;

    const telegramCookie = event.cookies.get(AUTH_TELEGRAM_COOKIE_NAME);

    if (
        !telegramCookie ||
        !(telegramUser = telegramService.parseJwt(telegramCookie))
    ) {
        const loginUrl = new URL("/login", event.url.origin);
        loginUrl.searchParams.set(REDIRECT_PARAM_NAME, event.url.toString());

        throw redirect(303, loginUrl);
    }

    event.locals.telegramUser = telegramUser;

    let tokens = {
        accessToken: event.cookies.get(AUTH_ACCESS_COOKIE_NAME),
        refreshToken: event.cookies.get(AUTH_REFRESH_COOKIE_NAME),
        secret: null as string | null
    };
    let updateTokens = false;

    if (!tokens.accessToken && !tokens.refreshToken) {
        user = await userService.getUserById(telegramUser.id);
        if (!user) {
            return resolve(event);
        }

        updateTokens = true;
    }

    if (!updateTokens) {
        tokens.secret = await userService.getUserSecretById(telegramUser.id);
        if (!tokens.secret) {
            user = await userService.getUserById(telegramUser.id);
            if (!user) {
                return resolve(event);
            }

            updateTokens = true;
        }
    }

    if (tokens.accessToken && !updateTokens) {
        user = userService.parseJwt(tokens.accessToken, tokens.secret!);

        if (!user) {
            if (
                !tokens.refreshToken ||
                !(user = userService.parseJwt(
                    tokens.refreshToken,
                    tokens.secret!
                ))
            ) {
                user = await userService.getUserById(telegramUser.id);
                if (!user) {
                    return resolve(event);
                }
            }

            updateTokens = true;
        }
    } else if (!updateTokens) {
        user = userService.parseJwt(tokens.refreshToken!, tokens.secret!);
        if (!user) {
            user = await userService.getUserById(telegramUser.id);
            if (!user) {
                return resolve(event);
            }
        }
        updateTokens = true;
    }

    if (updateTokens) {
        tokens = userService.generateJwt(user!);

        event.cookies.set(AUTH_ACCESS_COOKIE_NAME, tokens.accessToken!, {
            secure: false,
            httpOnly: true,
            sameSite: true,
            path: "/",
            domain: event.url.hostname
        });
        event.cookies.set(AUTH_REFRESH_COOKIE_NAME, tokens.refreshToken!, {
            secure: false,
            httpOnly: true,
            sameSite: true,
            path: "/",
            domain: event.url.hostname
        });
        await userService.setUserSecretById(telegramUser.id, tokens.secret!);
    }

    event.locals.user = user!;

    return resolve(event);
};

createUser({
    id: BigInt(ADMIN_ID),
    firstName: "Влад",
    lastName: "Король",
    role: "ADMIN"
}).catch(() => updateUser({ id: BigInt(ADMIN_ID), role: "ADMIN" }));
