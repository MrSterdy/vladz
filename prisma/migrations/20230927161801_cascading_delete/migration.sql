-- DropForeignKey
ALTER TABLE "DateSubject" DROP CONSTRAINT "DateSubject_groupId_fkey";

-- DropForeignKey
ALTER TABLE "DateSubject" DROP CONSTRAINT "DateSubject_timetableDate_fkey";

-- DropForeignKey
ALTER TABLE "DateTimetable" DROP CONSTRAINT "DateTimetable_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Homework" DROP CONSTRAINT "Homework_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Homework" DROP CONSTRAINT "Homework_groupId_timetableDate_subjectPosition_fkey";

-- DropForeignKey
ALTER TABLE "Homework" DROP CONSTRAINT "Homework_timetableDate_fkey";

-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSecret" DROP CONSTRAINT "UserSecret_userId_fkey";

-- DropForeignKey
ALTER TABLE "WeekdaySubject" DROP CONSTRAINT "WeekdaySubject_groupId_fkey";

-- DropForeignKey
ALTER TABLE "WeekdaySubject" DROP CONSTRAINT "WeekdaySubject_timetableWeekday_fkey";

-- DropForeignKey
ALTER TABLE "WeekdayTimetable" DROP CONSTRAINT "WeekdayTimetable_groupId_fkey";

-- AddForeignKey
ALTER TABLE "WeekdayTimetable" ADD CONSTRAINT "WeekdayTimetable_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekdaySubject" ADD CONSTRAINT "WeekdaySubject_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekdaySubject" ADD CONSTRAINT "WeekdaySubject_timetableWeekday_fkey" FOREIGN KEY ("timetableWeekday") REFERENCES "WeekdayTimetable"("weekday") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateTimetable" ADD CONSTRAINT "DateTimetable_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateSubject" ADD CONSTRAINT "DateSubject_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateSubject" ADD CONSTRAINT "DateSubject_timetableDate_fkey" FOREIGN KEY ("timetableDate") REFERENCES "DateTimetable"("date") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_timetableDate_fkey" FOREIGN KEY ("timetableDate") REFERENCES "DateTimetable"("date") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_groupId_timetableDate_subjectPosition_fkey" FOREIGN KEY ("groupId", "timetableDate", "subjectPosition") REFERENCES "DateSubject"("groupId", "timetableDate", "position") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSecret" ADD CONSTRAINT "UserSecret_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
