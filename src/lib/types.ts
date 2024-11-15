import type { userRoles, groupUserRoles } from "$lib/consts";

type BaseUser = {
    id: bigint;

    firstName: string;
    lastName: string;
};

export type User = BaseUser & {
    role: keyof typeof userRoles;
};

export type Account = User & {
    settings: {
        notifications: {
            timetable?: boolean;
            application_new?: boolean;
        };
    } | null;
};

export type GroupUser = BaseUser & {
    role: keyof typeof groupUserRoles;
};

export type Timetable<TSubject extends DaySubject = DaySubject> = {
    offset: number;

    subjects: TSubject[];
};

export type WeekdayTimetable = Timetable<WeekdaySubject> & {
    weekday: number;

    subjectLength: number;
    subjectBreak: number;
};

export type DateTimetable = Timetable<DateSubject> & {
    date: string;

    note: string | null;
};

export type Subject = {
    name: string;

    teacher: string | null;

    classroom: string | null;
};

export type DaySubject = Subject & { length: number; break: number };

export type WeekdaySubject = DaySubject & { position: number };

export type DateSubject = WeekdaySubject & {
    homework: {
        text: string;
        files: { url: string; name: string; type: string }[];
    };
};

export type Holiday = {
    startDate: string;
    endDate: string;
};

export type Group = {
    id: number;

    name: string;

    inviteCode: string;
};

export type DetailedGroup = Group & {
    users: GroupUser[];

    applications: BaseUser[];
};

export type GroupCluster = {
    id: number;

    name: string;

    manager: User;
};

export type List<T> = {
    items: T[];
    page: number;
    total: number;
};
