import prisma from "$lib/server/db/prisma";
import type { Subject } from "$lib/types";

export async function getSubjects(): Promise<Subject[]> {
    const result = await prisma.subject.findMany();

    return result.map(subject => ({
        id: subject.id,
        name: subject.name,
        teacher: subject.teacher,
        classroom: subject.classroom
    }));
}

export async function getSubjectById(id: number) {
    const result = await prisma.subject.findFirst({ where: { id } });

    return result
        ? ({
              id: result.id,
              name: result.name,
              teacher: result.teacher,
              classroom: result.classroom
          } as Subject)
        : null;
}

export async function updateSubjects(groupId: number, subjects: Subject[]) {
    const deleteOperation = prisma.subject.deleteMany({ where: { groupId } });
    const createOperation = prisma.subject.createMany({ data: subjects.map(subject => ({ ...subject, groupId })) });

    await prisma.$transaction([deleteOperation, createOperation]);
}
