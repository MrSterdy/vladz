-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'HELPER', 'USER');

-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('CURATOR', 'REDACTOR', 'STUDENT', 'APPLICATION');

-- CreateTable
CREATE TABLE "WeekdayTimetable" (
    "weekday" INTEGER NOT NULL,
    "offset" INTEGER NOT NULL,
    "subjectLength" INTEGER NOT NULL,
    "subjectBreak" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "WeekdaySubject" (
    "name" VARCHAR(128) NOT NULL,
    "length" INTEGER NOT NULL,
    "break" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "teacher" VARCHAR(256),
    "classroom" VARCHAR(128) NOT NULL,
    "groupId" INTEGER NOT NULL,
    "timetableWeekday" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "DateTimetable" (
    "date" DATE NOT NULL,
    "offset" INTEGER NOT NULL,
    "note" VARCHAR(256) NOT NULL,
    "groupId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "DateSubject" (
    "name" VARCHAR(128) NOT NULL,
    "length" INTEGER NOT NULL,
    "break" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "teacher" VARCHAR(256),
    "classroom" VARCHAR(128) NOT NULL,
    "groupId" INTEGER NOT NULL,
    "timetableDate" DATE NOT NULL
);

-- CreateTable
CREATE TABLE "Homework" (
    "groupId" INTEGER NOT NULL,
    "timetableDate" DATE NOT NULL,
    "subjectPosition" INTEGER NOT NULL,
    "content" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Subject" (
    "name" VARCHAR(128) NOT NULL,
    "length" INTEGER NOT NULL,
    "break" INTEGER NOT NULL,
    "teacher" VARCHAR(256),
    "classroom" VARCHAR(128) NOT NULL
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "inviteCode" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" BIGINT NOT NULL,
    "firstName" VARCHAR(128) NOT NULL,
    "lastName" VARCHAR(128) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGroup" (
    "userId" BIGINT NOT NULL,
    "groupId" INTEGER NOT NULL,
    "role" "GroupRole" NOT NULL DEFAULT 'APPLICATION',

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateTable
CREATE TABLE "UserSecret" (
    "userId" BIGINT NOT NULL,
    "secret" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WeekdayTimetable_weekday_key" ON "WeekdayTimetable"("weekday");

-- CreateIndex
CREATE UNIQUE INDEX "WeekdaySubject_groupId_timetableWeekday_position_key" ON "WeekdaySubject"("groupId", "timetableWeekday", "position");

-- CreateIndex
CREATE UNIQUE INDEX "DateTimetable_date_key" ON "DateTimetable"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DateSubject_groupId_timetableDate_position_key" ON "DateSubject"("groupId", "timetableDate", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Homework_groupId_timetableDate_subjectPosition_key" ON "Homework"("groupId", "timetableDate", "subjectPosition");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserSecret_userId_key" ON "UserSecret"("userId");

-- AddForeignKey
ALTER TABLE "WeekdayTimetable" ADD CONSTRAINT "WeekdayTimetable_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekdaySubject" ADD CONSTRAINT "WeekdaySubject_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekdaySubject" ADD CONSTRAINT "WeekdaySubject_timetableWeekday_fkey" FOREIGN KEY ("timetableWeekday") REFERENCES "WeekdayTimetable"("weekday") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateTimetable" ADD CONSTRAINT "DateTimetable_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateSubject" ADD CONSTRAINT "DateSubject_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateSubject" ADD CONSTRAINT "DateSubject_timetableDate_fkey" FOREIGN KEY ("timetableDate") REFERENCES "DateTimetable"("date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_timetableDate_fkey" FOREIGN KEY ("timetableDate") REFERENCES "DateTimetable"("date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_groupId_timetableDate_subjectPosition_fkey" FOREIGN KEY ("groupId", "timetableDate", "subjectPosition") REFERENCES "DateSubject"("groupId", "timetableDate", "position") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSecret" ADD CONSTRAINT "UserSecret_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
