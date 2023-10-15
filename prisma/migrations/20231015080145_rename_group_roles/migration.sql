/*
  Warnings:

  - The values [REDACTOR,STUDENT] on the enum `GroupRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GroupRole_new" AS ENUM ('CURATOR', 'EDITOR', 'MEMBER', 'APPLICATION');
ALTER TABLE "UserGroup" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "UserGroup" ALTER COLUMN "role" TYPE "GroupRole_new" USING ("role"::text::"GroupRole_new");
ALTER TYPE "GroupRole" RENAME TO "GroupRole_old";
ALTER TYPE "GroupRole_new" RENAME TO "GroupRole";
DROP TYPE "GroupRole_old";
ALTER TABLE "UserGroup" ALTER COLUMN "role" SET DEFAULT 'APPLICATION';
COMMIT;
