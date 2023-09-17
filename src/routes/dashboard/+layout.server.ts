import { error, type RequestEvent } from "@sveltejs/kit";

export async function load(event: RequestEvent) {
    if (!event.locals.telegramUser) {
        throw error(401);
    }
}