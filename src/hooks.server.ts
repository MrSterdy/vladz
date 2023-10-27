import {
    redirect,
    type Handle,
    error,
    type HandleServerError
} from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import dayjs from "dayjs";
import "dayjs/locale/ru";

import { ADMIN_ID } from "$env/static/private";

import {
    AUTH_ACCESS_COOKIE_NAME,
    AUTH_REFRESH_COOKIE_NAME,
    AUTH_TELEGRAM_COOKIE_NAME,
    REDIRECT_PARAM_NAME
} from "$lib/consts";
import bot from "$lib/server/bot";
import { getClusterById } from "$lib/server/services/clusterService";
import { getGroupById } from "$lib/server/services/groupService";
import * as telegramService from "$lib/server/services/telegramService";
import * as userService from "$lib/server/services/userService";
import {
    createUser,
    getManagement,
    updateUser
} from "$lib/server/services/userService";
import type { Account } from "$lib/types";

export const authenticationHandler: Handle = async ({ event, resolve }) => {
    if (
        event.url.pathname.startsWith("/auth/login") ||
        event.url.pathname.startsWith("/api")
    ) {
        return resolve(event);
    }

    let user: Account | null = null;
    let telegramId: bigint | null = null;

    const telegramCookie = event.cookies.get(AUTH_TELEGRAM_COOKIE_NAME);

    if (
        !telegramCookie ||
        !(telegramId = telegramService.parseJwt(telegramCookie))
    ) {
        throw redirect(
            303,
            `/auth/login?${REDIRECT_PARAM_NAME}=${encodeURIComponent(
                event.url.pathname + event.url.search
            )}`
        );
    }

    event.locals.telegramId = telegramId;

    let tokens = {
        accessToken: event.cookies.get(AUTH_ACCESS_COOKIE_NAME),
        refreshToken: event.cookies.get(AUTH_REFRESH_COOKIE_NAME),
        secret: null as string | null
    };
    let updateTokens = false;

    if (!tokens.accessToken && !tokens.refreshToken) {
        user = await userService.getAccountById(telegramId);
        if (user) {
            updateTokens = true;
        }
    }

    if (!user && !updateTokens) {
        tokens.secret = await userService.getUserSecretById(telegramId);
        if (!tokens.secret) {
            user = await userService.getAccountById(telegramId);
            if (user) {
                updateTokens = true;
            }
        }
    }

    if (!user && tokens.accessToken && !updateTokens) {
        user = userService.parseJwt(tokens.accessToken, tokens.secret!);

        if (!user) {
            if (
                !tokens.refreshToken ||
                !(user = userService.parseJwt(
                    tokens.refreshToken,
                    tokens.secret!
                ))
            ) {
                user = await userService.getAccountById(telegramId);
            }

            if (user) {
                updateTokens = true;
            }
        }
    } else if (!updateTokens) {
        user =
            userService.parseJwt(tokens.refreshToken!, tokens.secret!) ??
            (await userService.getAccountById(telegramId));

        if (user) {
            updateTokens = true;
        }
    }

    if (updateTokens) {
        tokens = userService.generateJwt(user!);

        event.cookies.set(AUTH_ACCESS_COOKIE_NAME, tokens.accessToken!, {
            secure: true,
            httpOnly: true,
            sameSite: "none",
            path: "/",
            domain: event.url.hostname
        });
        event.cookies.set(AUTH_REFRESH_COOKIE_NAME, tokens.refreshToken!, {
            secure: true,
            httpOnly: true,
            sameSite: "none",
            path: "/",
            domain: event.url.hostname
        });
        await userService.setUserSecretById(telegramId, tokens.secret!);
    }

    if (!user) {
        if (event.url.pathname.startsWith("/dashboard")) {
            throw redirect(303, "/auth/register");
        }
    } else {
        event.locals.user = user;
    }

    return resolve(event);
};

export const authorizationHandler: Handle = async ({ event, resolve }) => {
    const path = event.url.pathname;
    const user = event.locals.user!;

    if (path.startsWith("/management/edit") && user.role !== "ADMIN") {
        throw error(403, { message: "Доступ запрещен" });
    }

    const groupId = Number(event.params["groupId"]);
    const clusterId = Number(event.params["clusterId"]);

    if (path.startsWith("/dashboard/cluster")) {
        if (user.role === "USER") {
            throw error(403, { message: "Доступ запрещен" });
        }

        if (!path.startsWith("/dashboard/clusters")) {
            const cluster = await getClusterById(clusterId);
            if (!cluster) {
                throw error(400, { message: "Кластер не найден" });
            }

            event.locals.groupCluster = cluster;
        }
    } else if (path.startsWith("/dashboard/group") && !isNaN(groupId)) {
        const group = await getGroupById(groupId);
        if (!group) {
            throw error(400, { message: "Группа не найдена" });
        }

        const groupUser = group.users.find(gu => gu.id === user.id);
        if (!groupUser && user.role === "USER") {
            throw error(403, { message: "Доступ запрещен" });
        }

        const groupPath = path.split(/^\/dashboard\/group\/\d+/)[1];

        if (
            (groupPath.startsWith("/edit") && user.role === "USER") ||
            (groupPath.startsWith("/composition/edit") &&
                user.role === "USER" &&
                groupUser!.role !== "CURATOR") ||
            (path.includes("/edit") &&
                user.role === "USER" &&
                groupUser!.role === "MEMBER")
        ) {
            throw error(403, { message: "Доступ запрещен" });
        }

        event.locals.group = group;
        event.locals.groupUser = groupUser;
    }

    return resolve(event);
};

export const handle = sequence(authenticationHandler, authorizationHandler);

export const handleError: HandleServerError = ({ error }) => {
    console.error(error);

    return { message: "Произошла непредвиденная ошибка" };
};

const managementPromise = (async function () {
    const adminId = BigInt(ADMIN_ID);
    const management = await getManagement();

    const membersToDemote: Promise<void>[] = [];

    for (const user of management) {
        if (user.role === "ADMIN") {
            if (user.id === adminId) {
                return;
            }

            user.role = "HELPER";

            membersToDemote.push(updateUser(user));
        }
    }

    await Promise.all([
        ...membersToDemote,
        createUser({
            id: adminId,
            firstName: "Влад",
            lastName: "Король",
            role: "ADMIN"
        })
    ]);
})();

const botPromise = bot.launch();

if (import.meta.env.DEV) {
    managementPromise.catch(console.error);
    botPromise.catch(console.error);
}

dayjs.locale("ru");
