import type { Group, GroupUser, TelegramUser, User } from "$lib/types";

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user?: User;
            telegramUser?: TelegramUser;
            group?: Group;
            groupUser?: GroupUser;
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
