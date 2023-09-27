/*
  Warnings:

  - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Subject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,groupId]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_groupId_key" ON "Subject"("name", "groupId");
