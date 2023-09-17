import type { TelegramUser, User } from "$lib/types";

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user?: User;
            telegramUser?: TelegramUser;
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
