import { error, type RequestEvent } from "@sveltejs/kit";

export async function load(event: RequestEvent) {
    if (!event.locals.user) {
        throw error(401);
    }
}