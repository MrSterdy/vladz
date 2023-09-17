import { redirect, type RequestEvent, type Actions, fail } from "@sveltejs/kit";
import { createUser } from "$lib/server/services/userService";
import { AUTH_TELEGRAM_COOKIE_NAME } from "$lib/consts";
import { parseJwt } from "$lib/server/services/telegramService";

export async function load(event: RequestEvent) {
    if (event.locals.user) {
        throw redirect(303, "/dashboard");
    }
}

export const actions = {
    default: async (event) => {
        const telegramUser = parseJwt(event.cookies.get(AUTH_TELEGRAM_COOKIE_NAME) ?? "");
        if (!telegramUser) {
            return fail(401);
        }

        const form = await event.request.formData();

        const firstName = form.get("first_name");
        const lastName = form.get("last_name");

        if (typeof firstName !== "string" || typeof lastName !== "string" || !firstName || !lastName) {
            return fail(400);
        }

        await createUser({
            id: telegramUser.id,
            firstName,
            lastName,
            role: "USER"
        });
    }
} satisfies Actions;
