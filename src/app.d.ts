import type { Account, DetailedGroup, GroupCluster, GroupUser } from "$lib/types";

declare global {
    namespace App {
        interface Error {
            message: string;
        }
        interface Locals {
            user?: Account;
            telegramId?: bigint;
            group?: DetailedGroup;
            groupUser?: GroupUser;
            groupCluster?: GroupCluster;
        }
        interface PageData {
            flash?: { type: "success" | "error"; message: string };
        }
        // interface Platform {}
    }
}

export {};
