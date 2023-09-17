import jwt from "jsonwebtoken";
import * as crypto from "crypto";

import prisma from "$lib/server/db/prisma";

import type { User } from "$lib/types";

export async function getUserById(id: bigint): Promise<User | null> {
    const result = await prisma.user.findFirst({ where: { id } });

    return result
        ? {
              id: result.id,
              firstName: result.firstName,
              lastName: result.lastName,
              role: result.role
          }
        : null;
}

export async function createUser(user: User) {
    await prisma.user.create({ data: user });
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

export function parseJwt(token: string, secret: string): User | null {
    try {
        const payload = jwt.verify(token, secret) as { userInfo: string };
        const user = JSON.parse(payload.userInfo) as User;
        user.id = BigInt(user.id);

        return user;
    } catch (e) {
        return null;
    }
}

export function generateJwt(user: User): {
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
