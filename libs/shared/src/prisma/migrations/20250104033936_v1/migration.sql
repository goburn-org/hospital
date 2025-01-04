-- CreateTable
CREATE TABLE "GRN" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "json" JSONB NOT NULL,

    CONSTRAINT "GRN_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GRN" ADD CONSTRAINT "GRN_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRN" ADD CONSTRAINT "GRN_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
