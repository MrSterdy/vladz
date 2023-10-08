import type { DateTimetable, WeekdayTimetable } from "$lib/types";
import prisma from "$lib/server/db/prisma";
import { formatISOString } from "$lib/utils";

export async function getDateTimetable(
    date: string,
    groupId: number
): Promise<DateTimetable | null> {
    const timetable = await prisma.dateTimetable.findFirst({
        where: { date, groupId },
        include: {
            subjects: { include: { homeworkText: true, homeworkFiles: true } }
        }
    });

    return timetable
        ? {
              date: formatISOString(timetable.date),
              offset: timetable.offset,
              note: timetable.note,
              subjects: timetable.subjects
                  .sort((a, b) => a.position - b.position)
                  .map(subject => ({
                      ...subject,
                      homework: {
                          text: subject.homeworkText?.text ?? "",
                          files: subject.homeworkFiles.map(file => ({
                              name: file.name,
                              url: file.url,
                              type: file.type
                          }))
                      }
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
              subjectLength: timetable.subjectLength,
              subjectBreak: timetable.subjectBreak,
              subjects: timetable.subjects
                  .sort((a, b) => a.position - b.position)
                  .map(subject => ({
                      name: subject.name,
                      length: subject.length,
                      break: subject.break,
                      position: subject.position,
                      teacher: subject.teacher,
                      classroom: subject.classroom
                  }))
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
            ...timetable,
            subjects: {
                deleteMany: { timetableWeekday: timetable.weekday, groupId },
                create: timetable.subjects
            }
        },
        create: {
            ...timetable,
            subjects: {
                create: timetable.subjects
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
            ...timetable,
            subjects: {
                deleteMany: { timetableDate: timetable.date, groupId },
                create: timetable.subjects.map(subject => ({
                    ...subject,
                    homework: undefined,
                    homeworkFiles: {
                        connectOrCreate: subject.homework.files.map(file => ({
                            where: {
                                groupId_timetableDate_subjectPosition_url_name_type:
                                    {
                                        groupId,
                                        timetableDate: timetable.date,
                                        subjectPosition: subject.position,
                                        ...file
                                    }
                            },
                            create: file
                        }))
                    },
                    ...(subject.homework.text
                        ? {
                              homeworkText: {
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
                                      create: { text: subject.homework.text }
                                  }
                              }
                          }
                        : {})
                }))
            }
        },
        create: {
            groupId,
            ...timetable,
            subjects: {
                create: timetable.subjects.map(subject => ({
                    ...subject,
                    homework: undefined,
                    homeworkFiles: {
                        connectOrCreate: subject.homework.files.map(file => ({
                            where: {
                                groupId_timetableDate_subjectPosition_url_name_type:
                                    {
                                        groupId,
                                        timetableDate: timetable.date,
                                        subjectPosition: subject.position,
                                        ...file
                                    }
                            },
                            create: file
                        }))
                    },
                    ...(subject.homework.text
                        ? {
                              homeworkText: {
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
                                      create: { text: subject.homework.text }
                                  }
                              }
                          }
                        : {})
                }))
            }
        }
    });
}
