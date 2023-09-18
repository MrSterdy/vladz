export type User = {
    id: bigint;

    firstName: string;
    lastName: string;

    role: "ADMIN" | "HELPER" | "USER";
};

export type GroupUser = User & {
    role: "CURATOR" | "REDACTOR" | "STUDENT" | "APPLICATION";
};

export type TelegramUser = {
    id: bigint;

    first_name: string;
    last_name: string;

    username: string;
};

export type Group = {
    id: number;

    name: string;

    inviteCode: string;

    users: User[];
};
