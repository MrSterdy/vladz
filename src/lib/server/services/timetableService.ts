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
                  homework: subject.homework?.content ?? null,
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

export async function updateWeekdayTimetable(
    groupId: number,
    timetable: WeekdayTimetable
) {
    await prisma.weekdayTimetable.upsert({
        where: { weekday: timetable.weekday },
        update: {
            offset: timetable.offset,
            subjectLength: timetable.subjectLength,
            subjectBreak: timetable.subjectBreak,
            note: timetable.note,
            subjects: {
                deleteMany: { timetableWeekday: timetable.weekday },
                create: timetable.subjects.map(subject => ({
                    name: subject.name,
                    length: subject.length,
                    break: subject.break,
                    position: subject.position,
                    teacher: subject.teacher,
                    classroom: subject.classroom,
                    groupId
                }))
            }
        },
        create: {
            weekday: timetable.weekday,
            offset: timetable.offset,
            subjectLength: timetable.subjectLength,
            subjectBreak: timetable.subjectBreak,
            note: timetable.note,
            subjects: {
                create: timetable.subjects.map(subject => ({
                    name: subject.name,
                    length: subject.length,
                    break: subject.break,
                    position: subject.position,
                    teacher: subject.teacher,
                    classroom: subject.classroom,
                    groupId
                }))
            },
            groupId
        }
    });
}

export async function updateDateTimetable(
    groupId: number,
    timetable: DateTimetable
) {
    await prisma.dateTimetable.upsert({
        where: { date: timetable.date },
        update: {
            offset: timetable.offset,
            note: timetable.note,
            subjects: {
                deleteMany: { timetableDate: timetable.date },
                create: timetable.subjects.map(subject => ({
                    name: subject.name,
                    length: subject.length,
                    break: subject.break,
                    position: subject.position,
                    teacher: subject.teacher,
                    classroom: subject.classroom,
                    ...(subject.homework
                        ? {
                              homework: {
                                  connectOrCreate: {
                                      where: {
                                          groupId_timetableDate_subjectPosition:
                                              {
                                                  groupId,
                                                  timetableDate: timetable.date,
                                                  subjectPosition:
                                                      subject.position
                                              }
                                      },
                                      create: { content: subject.homework! }
                                  }
                              }
                          }
                        : {}),
                    groupId
                }))
            }
        },
        create: {
            date: timetable.date,
            offset: timetable.offset,
            note: timetable.note,
            subjects: {
                create: timetable.subjects.map(subject => ({
                    name: subject.name,
                    length: subject.length,
                    break: subject.break,
                    position: subject.position,
                    teacher: subject.teacher,
                    classroom: subject.classroom,
                    ...(subject.homework
                        ? {
                              homework: {
                                  create: { content: subject.homework }
                              }
                          }
                        : {}),
                    groupId
                }))
            },
            groupId
        }
    });
}
