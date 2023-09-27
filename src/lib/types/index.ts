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
    id: number;

    name: string;

    teacher: string | null;

    classroom: string | null;
};

export type DaySubject = Omit<Subject, "id"> & { length: number; break: number; };

export type WeekdaySubject = DaySubject & { position: number };

export type DateSubject = WeekdaySubject & { homework: string | null };

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
