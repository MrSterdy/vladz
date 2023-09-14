-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'REDACTOR', 'STUDENT');

-- CreateTable
CREATE TABLE "WeekdayTimetable" (
    "weekday" INTEGER NOT NULL,
    "offset" INTEGER NOT NULL,
    "subjectLength" INTEGER NOT NULL,
    "subjectBreak" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "WeekdaySubject" (
    "name" VARCHAR(128) NOT NULL,
    "length" INTEGER NOT NULL,
    "break" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "classroom" VARCHAR(128) NOT NULL,
    "timetableWeekday" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "DateTimetable" (
    "date" DATE NOT NULL,
    "offset" INTEGER NOT NULL,
    "note" VARCHAR(256) NOT NULL
);

-- CreateTable
CREATE TABLE "DateSubject" (
    "name" VARCHAR(128) NOT NULL,
    "length" INTEGER NOT NULL,
    "break" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "teacherId" INTEGER,
    "teacherName" VARCHAR(256) NOT NULL,
    "classroom" VARCHAR(128) NOT NULL,
    "timetableDate" DATE NOT NULL
);

-- CreateTable
CREATE TABLE "Subject" (
    "name" VARCHAR(128) NOT NULL,
    "length" INTEGER NOT NULL,
    "break" INTEGER NOT NULL,
    "teacherId" INTEGER,
    "teacherName" VARCHAR(256) NOT NULL,
    "classroom" VARCHAR(128) NOT NULL
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(128) NOT NULL,
    "lastName" VARCHAR(128) NOT NULL,
    "middleName" VARCHAR(128),

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" BIGINT NOT NULL,
    "firstName" VARCHAR(128) NOT NULL,
    "lastName" VARCHAR(128) NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeekdayTimetable_weekday_key" ON "WeekdayTimetable"("weekday");

-- CreateIndex
CREATE UNIQUE INDEX "WeekdaySubject_timetableWeekday_position_key" ON "WeekdaySubject"("timetableWeekday", "position");

-- CreateIndex
CREATE UNIQUE INDEX "DateTimetable_date_key" ON "DateTimetable"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DateSubject_timetableDate_position_key" ON "DateSubject"("timetableDate", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- AddForeignKey
ALTER TABLE "WeekdaySubject" ADD CONSTRAINT "WeekdaySubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekdaySubject" ADD CONSTRAINT "WeekdaySubject_timetableWeekday_fkey" FOREIGN KEY ("timetableWeekday") REFERENCES "WeekdayTimetable"("weekday") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateSubject" ADD CONSTRAINT "DateSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateSubject" ADD CONSTRAINT "DateSubject_timetableDate_fkey" FOREIGN KEY ("timetableDate") REFERENCES "DateTimetable"("date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
