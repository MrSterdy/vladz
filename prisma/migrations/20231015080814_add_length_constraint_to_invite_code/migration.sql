/*
  Warnings:

  - You are about to alter the column `inviteCode` on the `Group` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(16)`.

*/
-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "inviteCode" SET DATA TYPE VARCHAR(16);
