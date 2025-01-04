-- CreateTable
CREATE TABLE "Intent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "createdBy" TEXT NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Intent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Intent" ADD CONSTRAINT "Intent_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
