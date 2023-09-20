-- AlterTable
ALTER TABLE "DateTimetable" ALTER COLUMN "note" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WeekdayTimetable" ADD COLUMN     "note" VARCHAR(256);
