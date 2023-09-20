-- AlterTable
ALTER TABLE "DateSubject" ALTER COLUMN "classroom" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ALTER COLUMN "classroom" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WeekdaySubject" ALTER COLUMN "classroom" DROP NOT NULL;
