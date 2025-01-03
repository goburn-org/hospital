/*
  Warnings:

  - Added the required column `customerName` to the `CounterSale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CounterSale" ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "patientVisitId" TEXT;

-- CreateTable
CREATE TABLE "CounterSaleBill" (
    "counterSaleId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paid" DOUBLE PRECISION NOT NULL,
    "payments" JSONB NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "CounterSaleBill_counterSaleId_key" ON "CounterSaleBill"("counterSaleId");

-- AddForeignKey
ALTER TABLE "CounterSale" ADD CONSTRAINT "CounterSale_patientVisitId_fkey" FOREIGN KEY ("patientVisitId") REFERENCES "PatientVisit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounterSaleBill" ADD CONSTRAINT "CounterSaleBill_counterSaleId_fkey" FOREIGN KEY ("counterSaleId") REFERENCES "CounterSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
