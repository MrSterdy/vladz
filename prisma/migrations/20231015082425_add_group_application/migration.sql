/*
  Warnings:

  - The values [APPLICATION] on the enum `GroupRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GroupRole_new" AS ENUM ('CURATOR', 'EDITOR', 'MEMBER');
ALTER TABLE "GroupUser" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "GroupUser" ALTER COLUMN "role" TYPE "GroupRole_new" USING ("role"::text::"GroupRole_new");
ALTER TYPE "GroupRole" RENAME TO "GroupRole_old";
ALTER TYPE "GroupRole_new" RENAME TO "GroupRole";
DROP TYPE "GroupRole_old";
ALTER TABLE "GroupUser" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;

-- AlterTable
ALTER TABLE "GroupUser" ALTER COLUMN "role" SET DEFAULT 'MEMBER';

-- CreateTable
CREATE TABLE "GroupApplication" (
    "groupId" INTEGER NOT NULL,
    "userId" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupApplication_groupId_userId_key" ON "GroupApplication"("groupId", "userId");

-- AddForeignKey
ALTER TABLE "GroupApplication" ADD CONSTRAINT "GroupApplication_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupApplication" ADD CONSTRAINT "GroupApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
