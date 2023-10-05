import prisma from "$lib/server/db/prisma";
import type { Group, GroupUser } from "$lib/types";

export async function getUserGroups(userId: bigint): Promise<Group[]> {
    const result = await prisma.userGroup.findMany({
        where: { userId },
        include: {
            group: { include: { userGroups: { include: { user: true } } } }
        }
    });

    return result.map(ug => ({
        id: ug.groupId,
        inviteCode: ug.group.inviteCode,
        name: ug.group.name,
        users: ug.group.userGroups.map(nestedUg => ({
            id: nestedUg.userId,
            firstName: nestedUg.user.firstName,
            lastName: nestedUg.user.lastName,
            role: nestedUg.role
        }))
    }));
}

export async function getGroupUser(
    userId: bigint,
    groupId: number
): Promise<GroupUser | null> {
    const result = await prisma.userGroup.findFirst({
        where: { userId, groupId },
        include: { user: true }
    });

    return result
        ? {
              id: userId,
              firstName: result.user.firstName,
              lastName: result.user.lastName,
              role: result.role
          }
        : null;
}

export async function removeGroupUser(userId: bigint, groupId: number) {
    await prisma.userGroup.delete({
        where: { userId_groupId: { userId, groupId } }
    });
}

export async function updateGroupUserRole(
    userId: bigint,
    groupId: number,
    role: GroupUser["role"]
) {
    await prisma.userGroup.update({
        where: { userId_groupId: { userId, groupId } },
        data: { role }
    });
}

export async function addUserToGroup(userId: bigint, groupId: number) {
    await prisma.userGroup.create({ data: { userId, groupId } });
}

export async function removeUserFromGroup(userId: bigint, groupId: number) {
    await prisma.userGroup.delete({
        where: { userId_groupId: { userId, groupId } }
    });
}
