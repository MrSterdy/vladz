import type { userRoles, groupUserRoles } from "$lib/consts";

type BaseUser = {
    id: bigint;

    firstName: string;
    lastName: string;
};

export type User = BaseUser & {
    role: keyof typeof userRoles;
};

export type GroupUser = BaseUser & {
    role: keyof typeof groupUserRoles
};

export type Timetable<TSubject extends DaySubject = DaySubject> = {
    offset: number;

    note: string | null;

    subjects: TSubject[];
};

export type WeekdayTimetable = Timetable<WeekdaySubject> & {
    weekday: number;

    subjectLength: number;
    subjectBreak: number;
};

export type DateTimetable = Timetable<DateSubject> & {
    date: string;

    subjects: Subject[];
};

export type Subject = {
    name: string;

    teacher: string | null;

    classroom: string | null;
};

export type DaySubject = Subject & { length: number; break: number; };

export type WeekdaySubject = DaySubject & { position: number };

export type DateSubject = WeekdaySubject & { homework: string | null };

export type Holiday = {
    startDate: string;
    endDate: string;
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
