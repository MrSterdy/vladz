import type { DateTimetable, WeekdayTimetable } from "$lib/types";
import prisma from "$lib/server/db/prisma";
import { formatISOString } from "$lib/utils";

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
              date: formatISOString(timetable.date),
              offset: timetable.offset,
              note: timetable.note,
              subjects: timetable.subjects
                  .sort((a, b) => a.position - b.position)
                  .map(subject => ({
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
              subjects: timetable.subjects
                  .sort((a, b) => a.position - b.position)
                  .map(subject => ({
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
        where: { weekday_groupId: { weekday: timetable.weekday, groupId } },
        update: {
            offset: timetable.offset,
            subjectLength: timetable.subjectLength,
            subjectBreak: timetable.subjectBreak,
            note: timetable.note,
            subjects: {
                deleteMany: { timetableWeekday: timetable.weekday, groupId },
                create: timetable.subjects.map(subject => ({
                    name: subject.name,
                    length: subject.length,
                    break: subject.break,
                    position: subject.position,
                    teacher: subject.teacher,
                    classroom: subject.classroom
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
                    classroom: subject.classroom
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
        where: { groupId_date: { date: timetable.date, groupId } },
        update: {
            offset: timetable.offset,
            note: timetable.note,
            subjects: {
                deleteMany: { timetableDate: timetable.date, groupId },
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
                        : {})
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
                        : {})
                }))
            },
            groupId
        }
    });
}
