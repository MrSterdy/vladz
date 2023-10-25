import { pageSize } from "$lib/consts";
import prisma from "$lib/server/db/prisma";
import type { GroupCluster, List } from "$lib/types";

export async function getClusters(
    page = 1,
    search = ""
): Promise<List<GroupCluster>> {
    const like = search.toLowerCase().split(" ").join("");

    const [count, clusters] = await prisma.$transaction([
        prisma.groupCluster.count({
            where: { name: { contains: like, mode: "insensitive" } }
        }),
        prisma.groupCluster.findMany({
            take: pageSize,
            skip: (page - 1) * pageSize,
            where: { name: { contains: like, mode: "insensitive" } },
            include: {
                groups: true,
                manager: true
            }
        })
    ]);

    return {
        items: clusters.map(cluster => ({
            id: cluster.id,
            name: cluster.name,
            manager: {
                id: cluster.manager.id,
                firstName: cluster.manager.firstName,
                lastName: cluster.manager.lastName
            },
            groups: cluster.groups.map(group => ({
                id: group.id,
                name: group.name,
                inviteCode: group.inviteCode
            }))
        })),
        page,
        total: count
    };
}

export async function getUserClusters(
    userId: bigint,
    page = 1,
    search = ""
): Promise<List<GroupCluster>> {
    const like = search.toLowerCase().split(" ").join("");

    const [count, clusters] = await prisma.$transaction([
        prisma.groupCluster.count({
            where: {
                name: { contains: like, mode: "insensitive" },
                managerId: userId
            }
        }),
        prisma.groupCluster.findMany({
            take: pageSize,
            skip: (page - 1) * pageSize,
            where: {
                name: { contains: like, mode: "insensitive" },
                managerId: userId
            },
            include: {
                groups: true,
                manager: true
            }
        })
    ]);

    return {
        items: clusters.map(cluster => ({
            id: cluster.id,
            name: cluster.name,
            manager: {
                id: cluster.manager.id,
                firstName: cluster.manager.firstName,
                lastName: cluster.manager.lastName
            },
            groups: cluster.groups.map(group => ({
                id: group.id,
                name: group.name,
                inviteCode: group.inviteCode
            }))
        })),
        page,
        total: count
    };
}

export async function createCluster(name: string, userId: bigint) {
    await prisma.groupCluster.create({ data: { name, managerId: userId } });
}

export async function getClusterById(
    clusterId: number
): Promise<GroupCluster | null> {
    const result = await prisma.groupCluster.findFirst({
        where: { id: clusterId },
        include: {
            groups: true,
            manager: true
        }
    });

    return result
        ? {
              id: result.id,
              name: result.name,
              manager: {
                  id: result.manager.id,
                  firstName: result.manager.firstName,
                  lastName: result.manager.lastName
              },
              groups: result.groups.map(group => ({
                  id: group.id,
                  name: group.name,
                  inviteCode: group.inviteCode
              }))
          }
        : null;
}
