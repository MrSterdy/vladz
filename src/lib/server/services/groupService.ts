import type { Group } from "$lib/types";
import prisma from "$lib/server/db/prisma";
import * as crypto from "crypto";

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
              users: result.userGroups.map(ug => ({
                  id: ug.userId,
                  firstName: ug.user.firstName,
                  lastName: ug.user.lastName,
                  role: ug.role
              }))
          }
        : null;
}

export async function getGroups(): Promise<Group[]> {
    const result = await prisma.group.findMany({
        include: { userGroups: { include: { user: true } } }
    });

    return result.map(group => ({
        id: group.id,
        inviteCode: group.inviteCode,
        name: group.name,
        users: group.userGroups.map(ug => ({
            id: ug.userId,
            firstName: ug.user.firstName,
            lastName: ug.user.lastName,
            role: ug.role
        }))
    }));
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
              users: result.userGroups.map(ug => ({
                  id: ug.userId,
                  firstName: ug.user.firstName,
                  lastName: ug.user.lastName,
                  role: ug.role
              }))
          }
        : null;
}

export async function createGroup(name: string): Promise<Group> {
    const result = await prisma.group.create({
        data: { name, inviteCode: crypto.randomBytes(8).toString("hex") }
    });

    return {
        id: result.id,
        name: result.name,
        inviteCode: result.inviteCode,
        users: []
    };
}
