import prisma from "$lib/server/db/prisma";
import type { Subject } from "$lib/types";

export async function getSubjects(groupId: number): Promise<Subject[]> {
    const result = await prisma.subject.findMany();

    return result.map(subject => ({
        name: subject.name,
        teacher: subject.teacher,
        classroom: subject.classroom
    }));
}

export async function updateSubjects(groupId: number, subjects: Subject[]) {
    const deleteOperation = prisma.subject.deleteMany({ where: { groupId } });
    const createOperation = prisma.subject.createMany({ data: subjects.map(subject => ({ ...subject, groupId })) });

    await prisma.$transaction([deleteOperation, createOperation]);
}
