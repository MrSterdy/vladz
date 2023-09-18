import prisma from "$lib/server/db/prisma";
import type { Group, User } from "$lib/types";

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
        users: ug.group.userGroups.map(nestedUg => nestedUg.user)
    }));
}

export async function getGroupUsers(groupId: number): Promise<User[]> {
    const result = await prisma.userGroup.findMany({
        where: { groupId },
        include: { user: true }
    });

    return result.map(ug => ug.user);
}

export async function addUserToGroup(userId: bigint, groupId: number) {
    await prisma.userGroup.create({ data: { userId, groupId } });
}
