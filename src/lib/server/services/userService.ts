import type { User as RawUser } from "@prisma/client";
import * as crypto from "crypto";
import jwt from "jsonwebtoken";

import { pageSize } from "$lib/consts";
import prisma from "$lib/server/db/prisma";
import type { Account, List, User } from "$lib/types";

export async function getAccountById(id: bigint): Promise<Account | null> {
    const result = await prisma.user.findFirst({
        where: { id }
    });

    return result
        ? {
            id: result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            role: result.role,
            settings: (result.settings as Account["settings"] | undefined) ?? null
        }
        : null;
}

export async function getUserById(id: bigint): Promise<User | null> {
    const result = await prisma.user.findFirst({
        where: { id }
    });

    return result
        ? {
              id: result.id,
              firstName: result.firstName,
              lastName: result.lastName,
              role: result.role
          }
        : null;
}

export async function getManagement(): Promise<User[]> {
    const result = await prisma.user.findMany({
        where: { OR: [{ role: "ADMIN" }, { role: "HELPER" }] }
    });

    return result.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
    }));
}

export async function createUser(user: User) {
    await prisma.user.upsert({
        create: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        },
        update: { role: user.role },
        where: { id: user.id }
    });
}

export async function updateUser(user: Partial<User> & Pick<User, "id">) {
    const removeSecret = prisma.userSecret.delete({
        where: { userId: user.id }
    });
    const updateUser = prisma.user.update({
        where: { id: user.id },
        data: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }
    });

    await prisma.$transaction([removeSecret, updateUser]);
}

export async function searchUsers(name: string, page = 1): Promise<List<User>> {
    const like = `%${name
        .toLowerCase()
        .split(" ")
        .join("")}%`;

    const [count, users] = await prisma.$transaction([
        prisma.$queryRaw<
            [{ count: number }]
        >`SELECT COUNT(U.*) FROM public."User" U WHERE lower(concat(U."firstName", U."lastName")) LIKE ${like}`,
        prisma.$queryRaw<
            RawUser[]
        >`SELECT U.* FROM public."User" U WHERE lower(concat(U."firstName", U."lastName")) LIKE ${like} OFFSET ${
            (page - 1) * pageSize
        } LIMIT ${pageSize}`
    ]);

    return {
        items: users.map(u => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            role: u.role
        })),
        page,
        total: Number(count[0].count)
    };
}

export async function getUserSecretById(
    userId: bigint
): Promise<string | null> {
    const result = await prisma.userSecret.findFirst({ where: { userId } });

    return result ? result.secret : null;
}

export async function setUserSecretById(userId: bigint, secret: string) {
    await prisma.userSecret.upsert({
        where: { userId },
        update: { secret },
        create: { userId, secret }
    });
}

export function parseJwt(token: string, secret: string): Account | null {
    try {
        const payload = jwt.verify(token, secret) as { userInfo: string };
        const user = JSON.parse(payload.userInfo) as Account;
        user.id = BigInt(user.id);

        return user;
    } catch (e) {
        return null;
    }
}

export function generateJwt(user: Account): {
    accessToken: string;
    refreshToken: string;
    secret: string;
} {
    const userInfo = {
        userInfo: JSON.stringify(user, (_, v) =>
            typeof v === "bigint" ? v.toString() : v
        )
    };

    const secret = crypto.randomBytes(48).toString("hex");
    const accessToken = jwt.sign(userInfo, secret, { expiresIn: "1d" });
    const refreshToken = jwt.sign(userInfo, secret, { expiresIn: "30d" });

    return { secret, accessToken, refreshToken };
}
