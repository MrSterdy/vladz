-- CreateTable
CREATE TABLE "HomeworkFile" (
    "groupId" INTEGER NOT NULL,
    "timetableDate" DATE NOT NULL,
    "subjectPosition" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HomeworkFile_groupId_timetableDate_subjectPosition_name_key" ON "HomeworkFile"("groupId", "timetableDate", "subjectPosition", "name");

-- AddForeignKey
ALTER TABLE "HomeworkFile" ADD CONSTRAINT "HomeworkFile_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkFile" ADD CONSTRAINT "HomeworkFile_timetableDate_groupId_fkey" FOREIGN KEY ("timetableDate", "groupId") REFERENCES "DateTimetable"("date", "groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkFile" ADD CONSTRAINT "HomeworkFile_groupId_timetableDate_subjectPosition_fkey" FOREIGN KEY ("groupId", "timetableDate", "subjectPosition") REFERENCES "DateSubject"("groupId", "timetableDate", "position") ON DELETE CASCADE ON UPDATE CASCADE;
