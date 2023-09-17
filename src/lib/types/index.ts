export type User = {
    id: bigint;

    firstName: string;
    lastName: string;

    role: "ADMIN" | "HELPER" | "USER";
};

export type TelegramUser = {
    id: bigint;

    first_name: string;
    last_name: string;

    username: string;
}
