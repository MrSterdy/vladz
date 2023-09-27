/*
  Warnings:

  - A unique constraint covering the columns `[name,groupId]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Subject_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_groupId_key" ON "Subject"("name", "groupId");
