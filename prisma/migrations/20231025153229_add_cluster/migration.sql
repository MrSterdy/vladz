-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "clusterId" INTEGER;

-- CreateTable
CREATE TABLE "GroupCluster" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "managerId" BIGINT NOT NULL,

    CONSTRAINT "GroupCluster_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "GroupCluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupCluster" ADD CONSTRAINT "GroupCluster_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
