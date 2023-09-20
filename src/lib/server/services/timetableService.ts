import type { DateTimetable, WeekdayTimetable } from "$lib/types";
import prisma from "$lib/server/db/prisma";

export async function getDateTimetable(
    date: string,
    groupId: number
): Promise<DateTimetable | null> {
    const timetable = await prisma.dateTimetable.findFirst({
        where: { date, groupId },
        include: { subjects: { include: { homework: true } } }
    });

    return timetable
        ? {
              date: timetable.date.toISOString().split("T")[0],
              offset: timetable.offset,
              note: timetable.note,
              subjects: timetable.subjects.map(subject => ({
                  name: subject.name,
                  length: subject.length,
                  break: subject.break,
                  position: subject.position,
                  homework: subject.homework?.content,
                  teacher: subject.teacher,
                  classroom: subject.classroom
              }))
          }
        : null;
}

export async function getWeekdayTimetable(
    weekday: number,
    groupId: number
): Promise<WeekdayTimetable | null> {
    const timetable = await prisma.weekdayTimetable.findFirst({
        where: { weekday, groupId },
        include: { subjects: true }
    });

    return timetable
        ? {
            weekday,
            offset: timetable.offset,
            note: timetable.note,
            subjects: timetable.subjects.map(subject => ({
                name: subject.name,
                length: subject.length,
                break: subject.break,
                position: subject.position,
                teacher: subject.teacher,
                classroom: subject.classroom
            })),
            subjectLength: timetable.subjectLength,
            subjectBreak: timetable.subjectBreak
        }
        : null;
}
