-- DropForeignKey
ALTER TABLE "BillingPatientOrderLineItem" DROP CONSTRAINT "BillingPatientOrderLineItem_orderId_fkey";

-- AlterTable
ALTER TABLE "BillingPatientOrderLineItem" ADD COLUMN     "patientOrderVisitId" TEXT;

-- AddForeignKey
ALTER TABLE "BillingPatientOrderLineItem" ADD CONSTRAINT "BillingPatientOrderLineItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingPatientOrderLineItem" ADD CONSTRAINT "BillingPatientOrderLineItem_patientOrderVisitId_fkey" FOREIGN KEY ("patientOrderVisitId") REFERENCES "PatientOrder"("visitId") ON DELETE SET NULL ON UPDATE CASCADE;
