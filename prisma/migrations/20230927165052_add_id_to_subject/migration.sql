-- DropIndex
DROP INDEX "Subject_name_groupId_key";

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Subject_pkey" PRIMARY KEY ("id");
