import type { Group } from "$lib/types";
import prisma from "$lib/server/db/prisma";

export async function getGroupByInviteCode(
    inviteCode: string
): Promise<Group | null> {
    const result = await prisma.group.findFirst({
        where: { inviteCode },
        include: { userGroups: { include: { user: true } } }
    });

    return result
        ? {
              id: result.id,
              inviteCode,
              name: result.name,
              users: result.userGroups.map(ug => ug.user)
          }
        : null;
}

export async function getGroupById(groupId: number): Promise<Group | null> {
    const result = await prisma.group.findFirst({
        where: { id: groupId },
        include: { userGroups: { include: { user: true } } }
    });

    return result
        ? {
            id: result.id,
            inviteCode: result.inviteCode,
            name: result.name,
            users: result.userGroups.map(ug => ug.user)
        }
        : null;
}
