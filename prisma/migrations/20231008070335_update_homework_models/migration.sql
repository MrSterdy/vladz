/*
  Warnings:

  - You are about to alter the column `name` on the `HomeworkFile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to drop the `Homework` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[groupId,timetableDate,subjectPosition,url,name]` on the table `HomeworkFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `HomeworkFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Homework" DROP CONSTRAINT "Homework_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Homework" DROP CONSTRAINT "Homework_groupId_timetableDate_subjectPosition_fkey";

-- DropForeignKey
ALTER TABLE "Homework" DROP CONSTRAINT "Homework_timetableDate_groupId_fkey";

-- DropIndex
DROP INDEX "HomeworkFile_groupId_timetableDate_subjectPosition_name_key";

-- AlterTable
ALTER TABLE "HomeworkFile" ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(128);

-- DropTable
DROP TABLE "Homework";

-- CreateTable
CREATE TABLE "HomeworkText" (
    "groupId" INTEGER NOT NULL,
    "timetableDate" DATE NOT NULL,
    "subjectPosition" INTEGER NOT NULL,
    "text" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HomeworkText_groupId_timetableDate_subjectPosition_key" ON "HomeworkText"("groupId", "timetableDate", "subjectPosition");

-- CreateIndex
CREATE UNIQUE INDEX "HomeworkFile_groupId_timetableDate_subjectPosition_url_name_key" ON "HomeworkFile"("groupId", "timetableDate", "subjectPosition", "url", "name");

-- AddForeignKey
ALTER TABLE "HomeworkText" ADD CONSTRAINT "HomeworkText_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkText" ADD CONSTRAINT "HomeworkText_timetableDate_groupId_fkey" FOREIGN KEY ("timetableDate", "groupId") REFERENCES "DateTimetable"("date", "groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkText" ADD CONSTRAINT "HomeworkText_groupId_timetableDate_subjectPosition_fkey" FOREIGN KEY ("groupId", "timetableDate", "subjectPosition") REFERENCES "DateSubject"("groupId", "timetableDate", "position") ON DELETE CASCADE ON UPDATE CASCADE;
