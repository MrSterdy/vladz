import type { DateTimetable, Holiday, WeekdayTimetable } from "$lib/types";
import prisma from "$lib/server/db/prisma";
import { formatISOString } from "$lib/utils";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

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
                      name: subject.name,
                      length: subject.length,
                      break: subject.break,
                      teacher: subject.teacher,
                      classroom: subject.classroom,
                      position: subject.position,
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
            weekday: timetable.weekday,
            offset: timetable.offset,
            note: timetable.note,
            subjectLength: timetable.subjectLength,
            subjectBreak: timetable.subjectBreak,
            subjects: {
                deleteMany: { timetableWeekday: timetable.weekday, groupId },
                create: timetable.subjects
            }
        },
        create: {
            weekday: timetable.weekday,
            offset: timetable.offset,
            note: timetable.note,
            subjectLength: timetable.subjectLength,
            subjectBreak: timetable.subjectBreak,
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
                    name: subject.name,
                    length: subject.length,
                    break: subject.break,
                    position: subject.position,
                    teacher: subject.teacher,
                    classroom: subject.classroom,
                    homeworkFiles: {
                        connectOrCreate: subject.homework.files.map(file => ({
                            where: {
                                groupId_timetableDate_subjectPosition_url_name_type:
                                    {
                                        groupId,
                                        timetableDate: timetable.date,
                                        subjectPosition: subject.position,
                                        url: file.url,
                                        name: file.name,
                                        type: file.type
                                    }
                            },
                            create: { url: file.url, name: file.name, type: file.type }
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
            date: timetable.date,
            offset: timetable.offset,
            note: timetable.note,
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
                                        url: file.url,
                                        name: file.name,
                                        type: file.type
                                    }
                            },
                            create: { url: file.url, name: file.name, type: file.type }
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

export async function findNextTimetableWithSubject(
    groupId: number,
    subjectName: string,
    startDate: Dayjs,
    holidays: Holiday[]
): Promise<{
    timetable: DateTimetable | WeekdayTimetable;
    date: Dayjs;
} | null> {
    const day = startDate.day();

    const weekdayTimetable = await findNearestWeekdayTimetableWithSubject(
        groupId,
        subjectName,
        day
    );
    if (!weekdayTimetable) {
        const dateTimetable =
            await findNearestDateTimetableWithSubject(
                groupId,
                subjectName,
                startDate.toISOString(),
                holidays
            );

        return dateTimetable
            ? {
                  timetable: {
                      date: dateTimetable.date.toISOString(),
                      offset: dateTimetable.offset,
                      note: dateTimetable.note,
                      subjects: dateTimetable.subjects.map(subject => ({
                          name: subject.name,
                          length: subject.length,
                          break: subject.break,
                          position: subject.position,
                          teacher: subject.teacher,
                          classroom: subject.classroom,
                          homework: { text: "", files: [] }
                      }))
                  },
                  date: dayjs(dateTimetable.date)
              }
            : null;
    }

    let nearestDay = weekdayTimetable.weekday - day;
    if (nearestDay <= 0) {
        nearestDay += 7;
    }

    const endDate = startDate.add(nearestDay, "days");

    const dateTimetable =
        await findDateTimetableWithSubjectInRange(
            groupId,
            subjectName,
            startDate.toISOString(),
            endDate.toISOString(),
            holidays
        );

    return dateTimetable
        ? {
              timetable: {
                  date: dateTimetable.date.toISOString(),
                  offset: dateTimetable.offset,
                  note: dateTimetable.note,
                  subjects: dateTimetable.subjects.map(subject => ({
                      name: subject.name,
                      length: subject.length,
                      break: subject.break,
                      position: subject.position,
                      teacher: subject.teacher,
                      classroom: subject.classroom,
                      homework: { text: "", files: [] }
                  }))
              },
              date: dayjs(dateTimetable.date)
          }
        : {
              timetable: {
                  weekday: weekdayTimetable.weekday,
                  subjectLength: weekdayTimetable.subjectLength,
                  subjectBreak: weekdayTimetable.subjectBreak,
                  offset: weekdayTimetable.offset,
                  note: weekdayTimetable.note,
                  subjects: weekdayTimetable.subjects.map(subject => ({
                      name: subject.name,
                      length: subject.length,
                      break: subject.break,
                      position: subject.position,
                      teacher: subject.teacher,
                      classroom: subject.classroom
                  }))
              },
              date: endDate
          };
}

function findDateTimetableWithSubjectInRange(
    groupId: number,
    subjectName: string,
    startDate: string,
    endDate: string,
    holidays: Holiday[]
) {
    return prisma.dateTimetable.findFirst({
        where: {
            AND: [
                {
                    groupId,
                    date: { gt: startDate, lte: endDate },
                    subjects: {
                        some: {
                            name: subjectName
                        }
                    }
                },
                ...holidays.map(holiday => ({
                    NOT: {
                        date: {
                            gte: holiday.startDate,
                            lte: holiday.startDate
                        }
                    }
                }))
            ]
        },
        include: { subjects: true },
        orderBy: { date: "asc" }
    });
}

function findNearestDateTimetableWithSubject(
    groupId: number,
    subjectName: string,
    startDate: string,
    holidays: Holiday[]
) {
    return prisma.dateTimetable.findFirst({
        where: {
            AND: [
                {
                    groupId,
                    date: { gt: startDate },
                    subjects: {
                        some: {
                            name: subjectName
                        }
                    }
                },
                ...holidays.map(holiday => ({
                    NOT: {
                        date: {
                            gte: holiday.startDate,
                            lte: holiday.startDate
                        }
                    }
                }))
            ]
        },
        include: { subjects: true },
        orderBy: { date: "asc" }
    });
}

async function findNearestWeekdayTimetableWithSubject(
    groupId: number,
    subjectName: string,
    weekday: number
) {
    let result = await prisma.weekdayTimetable.findFirst({
        where: {
            groupId,
            weekday: { gt: weekday },
            subjects: { some: { name: subjectName } }
        },
        orderBy: { weekday: "asc" },
        include: { subjects: true }
    });

    if (!result) {
        result = await prisma.weekdayTimetable.findFirst({
            where: {
                groupId,
                weekday: { gte: weekday },
                subjects: { some: { name: subjectName } }
            },
            orderBy: { weekday: "asc" },
            include: { subjects: true }
        });
    }

    return result;
}
