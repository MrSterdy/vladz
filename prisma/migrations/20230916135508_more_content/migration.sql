/*
  Warnings:

  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'HELPER', 'USER');

-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('CURATOR', 'REDACTOR', 'STUDENT');

-- AlterTable
ALTER TABLE "DateSubject" ALTER COLUMN "teacherName" DROP NOT NULL;

-- DropTable
DROP TABLE "Student";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Homework" (
    "timetableDate" DATE NOT NULL,
    "subjectPosition" INTEGER NOT NULL,
    "content" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,

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
    "role" "GroupRole" NOT NULL DEFAULT 'STUDENT',

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Homework_timetableDate_subjectPosition_key" ON "Homework"("timetableDate", "subjectPosition");

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_timetableDate_fkey" FOREIGN KEY ("timetableDate") REFERENCES "DateTimetable"("date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_timetableDate_subjectPosition_fkey" FOREIGN KEY ("timetableDate", "subjectPosition") REFERENCES "DateSubject"("timetableDate", "position") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
