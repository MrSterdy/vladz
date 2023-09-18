type BaseUser = {
    id: bigint;

    firstName: string;
    lastName: string;
};

export type User = BaseUser & {
    role: "ADMIN" | "HELPER" | "USER";
};

export type GroupUser = BaseUser & {
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

    users: GroupUser[];
};
