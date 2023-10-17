import type { Group, List } from "$lib/types";
import prisma from "$lib/server/db/prisma";
import * as crypto from "crypto";
import type { GroupUser } from "$lib/types";
import { pageSize } from "$lib/consts";

export async function getGroupByInviteCode(
    inviteCode: string
): Promise<Group | null> {
    const result = await prisma.group.findFirst({
        where: { inviteCode },
        include: {
            users: { include: { user: true } },
            applications: { include: { user: true } }
        }
    });

    return result
        ? {
              id: result.id,
              inviteCode,
              name: result.name,
              users: result.users.map(ug => ({
                  id: ug.userId,
                  firstName: ug.user.firstName,
                  lastName: ug.user.lastName,
                  role: ug.role
              })),
              applications: result.applications.map(a => ({
                  id: a.userId,
                  firstName: a.user.firstName,
                  lastName: a.user.lastName
              }))
          }
        : null;
}

export async function getGroups(page = 1): Promise<List<Group>> {
    const [count, groups] = await prisma.$transaction([
        prisma.group.count(),
        prisma.group.findMany({
            take: pageSize,
            skip: (page - 1) * pageSize,
            include: {
                users: { include: { user: true } },
                applications: { include: { user: true } }
            }
        })
    ]);

    return {
        items: groups.map(group => ({
            id: group.id,
            inviteCode: group.inviteCode,
            name: group.name,
            users: group.users.map(ug => ({
                id: ug.userId,
                firstName: ug.user.firstName,
                lastName: ug.user.lastName,
                role: ug.role
            })),
            applications: group.applications.map(a => ({
                id: a.userId,
                firstName: a.user.firstName,
                lastName: a.user.lastName
            }))
        })),
        page,
        total: count
    };
}

export async function getGroupById(groupId: number): Promise<Group | null> {
    const result = await prisma.group.findFirst({
        where: { id: groupId },
        include: {
            users: { include: { user: true } },
            applications: { include: { user: true } }
        }
    });

    return result
        ? {
              id: result.id,
              inviteCode: result.inviteCode,
              name: result.name,
              users: result.users.map(ug => ({
                  id: ug.userId,
                  firstName: ug.user.firstName,
                  lastName: ug.user.lastName,
                  role: ug.role
              })),
              applications: result.applications.map(a => ({
                  id: a.userId,
                  firstName: a.user.firstName,
                  lastName: a.user.lastName
              }))
          }
        : null;
}

export async function getUserGroups(
    userId: bigint,
    page = 1
): Promise<List<Group>> {
    const [count, groups] = await prisma.$transaction([
        prisma.group.count({ where: { users: { some: { userId } } } }),
        prisma.group.findMany({
            take: pageSize,
            skip: (page - 1) * pageSize,
            where: { users: { some: { userId } } },
            include: {
                users: { include: { user: true } },
                applications: { include: { user: true } }
            }
        })
    ]);

    return {
        items: groups.map(group => ({
            id: group.id,
            inviteCode: group.inviteCode,
            name: group.name,
            users: group.users.map(ug => ({
                id: ug.userId,
                firstName: ug.user.firstName,
                lastName: ug.user.lastName,
                role: ug.role
            })),
            applications: group.applications.map(a => ({
                id: a.userId,
                firstName: a.user.firstName,
                lastName: a.user.lastName
            }))
        })),
        page,
        total: count
    };
}

export async function getUserApplications(
    userId: bigint,
    page = 1
): Promise<List<Omit<Group, "users" | "applications">>> {
    const [count, applications] = await prisma.$transaction([
        prisma.groupApplication.count({ where: { userId } }),
        prisma.groupApplication.findMany({
            take: pageSize,
            skip: (page - 1) * pageSize,
            where: { userId },
            include: { group: true }
        })
    ]);

    return {
        items: applications.map(a => ({
            id: a.groupId,
            name: a.group.name,
            inviteCode: a.group.inviteCode
        })),
        total: count,
        page
    };
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

export async function createApplication(groupId: number, userId: bigint) {
    await prisma.groupApplication.create({ data: { userId, groupId } });
}

export async function removeApplication(groupId: number, userId: bigint) {
    await prisma.groupApplication.delete({
        where: { groupId_userId: { userId, groupId } }
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

export async function updateGroupName(groupId: number, groupName: string) {
    await prisma.group.update({
        where: { id: groupId },
        data: { name: groupName }
    });
}

export async function deleteGroup(groupId: number) {
    await prisma.group.delete({ where: { id: groupId } });
}

export async function createGroup(name: string): Promise<Group> {
    const result = await prisma.group.create({
        data: { name, inviteCode: crypto.randomBytes(8).toString("hex") }
    });

    return {
        id: result.id,
        name: result.name,
        inviteCode: result.inviteCode,
        users: [],
        applications: []
    };
}
