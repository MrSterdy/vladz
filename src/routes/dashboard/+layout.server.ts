import { error, type RequestEvent } from "@sveltejs/kit";

export const trailingSlash = "always";

export async function load(event: RequestEvent) {
    if (!event.locals.user) {
        throw error(401);
    }
}