/*
  Warnings:

  - You are about to drop the column `break` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `Subject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "break",
DROP COLUMN "length";
