-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "hospitalId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "BillingConsultationOrderLineItem" ADD COLUMN     "hospitalId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "BillingPatientOrderLineItem" ADD COLUMN     "hospitalId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "hospitalId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "VisitBilling" ADD COLUMN     "hospitalId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "BillingPatientOrderLineItem" ADD CONSTRAINT "BillingPatientOrderLineItem_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingConsultationOrderLineItem" ADD CONSTRAINT "BillingConsultationOrderLineItem_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitBilling" ADD CONSTRAINT "VisitBilling_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
