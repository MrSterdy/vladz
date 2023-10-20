import type { Group, GroupUser, User } from "$lib/types";

declare global {
    namespace App {
        interface Error {
            message: string;
        }
        interface Locals {
            user?: User;
            telegramId?: bigint;
            group?: Group;
            groupUser?: GroupUser;
        }
        interface PageData {
            flash?: { type: "success" | "error"; message: string };
        }
        // interface Platform {}
    }
}

export {};
