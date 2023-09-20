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

export type Timetable = {
    offset: number;

    note: string | null;

    subjects: Subject[];
};

export type WeekdayTimetable = Timetable & {
    weekday: number;

    subjectLength: number;
    subjectBreak: number;
};

export type DateTimetable = Timetable & {
    date: string;

    subjects: Subject[];
};

export type Subject = {
    name: string;

    length: number;
    break: number;

    position: number;

    teacher: string | null;

    classroom: string | null;

    homework?: string;
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
