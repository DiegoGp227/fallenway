-- CreateTable
CREATE TABLE "daily_contributions" (
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "completed" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "daily_contributions_pkey" PRIMARY KEY ("userId","date")
);

-- AddForeignKey
ALTER TABLE "daily_contributions" ADD CONSTRAINT "daily_contributions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
