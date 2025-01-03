-- CreateTable
CREATE TABLE "UOM" (
    "id" SERIAL NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UOM_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UOM" ADD CONSTRAINT "UOM_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
