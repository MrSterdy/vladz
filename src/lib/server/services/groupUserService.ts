import prisma from "$lib/server/db/prisma";
import type { Group, GroupUser } from "$lib/types";

export async function getUserGroups(userId: bigint): Promise<Group[]> {
    const result = await prisma.groupUser.findMany({
        where: { userId },
        include: {
            group: { include: { users: { include: { user: true } } } }
        }
    });

    return result.map(gu => ({
        id: gu.groupId,
        inviteCode: gu.group.inviteCode,
        name: gu.group.name,
        users: gu.group.users.map(nestedGu => ({
            id: nestedGu.userId,
            firstName: nestedGu.user.firstName,
            lastName: nestedGu.user.lastName,
            role: nestedGu.role
        }))
    }));
}

export async function getGroupUser(
    userId: bigint,
    groupId: number
): Promise<GroupUser | null> {
    const result = await prisma.groupUser.findFirst({
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
    await prisma.groupUser.delete({
        where: { userId_groupId: { userId, groupId } }
    });
}

export async function updateGroupUserRole(
    userId: bigint,
    groupId: number,
    role: GroupUser["role"]
) {
    await prisma.groupUser.update({
        where: { userId_groupId: { userId, groupId } },
        data: { role }
    });
}

export async function addUserToGroup(userId: bigint, groupId: number) {
    await prisma.groupUser.create({ data: { userId, groupId } });
}

export async function removeUserFromGroup(userId: bigint, groupId: number) {
    await prisma.groupUser.delete({
        where: { userId_groupId: { userId, groupId } }
    });
}
