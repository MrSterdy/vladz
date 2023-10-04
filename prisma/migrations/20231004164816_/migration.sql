/*
  Warnings:

  - A unique constraint covering the columns `[groupId,date]` on the table `DateTimetable` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[weekday,groupId]` on the table `WeekdayTimetable` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "DateSubject" DROP CONSTRAINT "DateSubject_timetableDate_fkey";

-- DropForeignKey
ALTER TABLE "Homework" DROP CONSTRAINT "Homework_timetableDate_fkey";

-- DropForeignKey
ALTER TABLE "WeekdaySubject" DROP CONSTRAINT "WeekdaySubject_timetableWeekday_fkey";

-- DropIndex
DROP INDEX "DateTimetable_date_key";

-- DropIndex
DROP INDEX "WeekdayTimetable_weekday_key";

-- CreateIndex
CREATE UNIQUE INDEX "DateTimetable_groupId_date_key" ON "DateTimetable"("groupId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "WeekdayTimetable_weekday_groupId_key" ON "WeekdayTimetable"("weekday", "groupId");

-- AddForeignKey
ALTER TABLE "WeekdaySubject" ADD CONSTRAINT "WeekdaySubject_timetableWeekday_groupId_fkey" FOREIGN KEY ("timetableWeekday", "groupId") REFERENCES "WeekdayTimetable"("weekday", "groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateSubject" ADD CONSTRAINT "DateSubject_timetableDate_groupId_fkey" FOREIGN KEY ("timetableDate", "groupId") REFERENCES "DateTimetable"("date", "groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_timetableDate_groupId_fkey" FOREIGN KEY ("timetableDate", "groupId") REFERENCES "DateTimetable"("date", "groupId") ON DELETE CASCADE ON UPDATE CASCADE;
