-- CreateTable
CREATE TABLE "Holiday" (
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "groupId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Holiday_startDate_endDate_groupId_key" ON "Holiday"("startDate", "endDate", "groupId");

-- AddForeignKey
ALTER TABLE "Holiday" ADD CONSTRAINT "Holiday_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
