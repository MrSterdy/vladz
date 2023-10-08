/*
  Warnings:

  - A unique constraint covering the columns `[groupId,timetableDate,subjectPosition,url,name,type]` on the table `HomeworkFile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "HomeworkFile_groupId_timetableDate_subjectPosition_url_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "HomeworkFile_groupId_timetableDate_subjectPosition_url_name_key" ON "HomeworkFile"("groupId", "timetableDate", "subjectPosition", "url", "name", "type");
