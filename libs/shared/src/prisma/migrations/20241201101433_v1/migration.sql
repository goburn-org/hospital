/*
  Warnings:

  - You are about to drop the `ConsultationOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BillingConsultationOrderLineItem" DROP CONSTRAINT "BillingConsultationOrderLineItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ConsultationOrder" DROP CONSTRAINT "ConsultationOrder_visitId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_consultationOrderId_fkey";

-- AlterTable
ALTER TABLE "BillingConsultationOrderLineItem" ADD COLUMN     "consultationOrderId" TEXT;

-- DropTable
DROP TABLE "ConsultationOrder";

-- AddForeignKey
ALTER TABLE "BillingConsultationOrderLineItem" ADD CONSTRAINT "BillingConsultationOrderLineItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
