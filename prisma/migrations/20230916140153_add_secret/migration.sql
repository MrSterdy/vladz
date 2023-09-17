-- CreateTable
CREATE TABLE "UserSecret" (
    "userId" BIGINT NOT NULL,
    "secret" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSecret_userId_key" ON "UserSecret"("userId");

-- AddForeignKey
ALTER TABLE "UserSecret" ADD CONSTRAINT "UserSecret_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
