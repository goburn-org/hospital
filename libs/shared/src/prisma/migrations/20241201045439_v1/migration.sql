-- CreateEnum
CREATE TYPE "OrderWorkflow" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "consultationOrderId" TEXT,
ADD COLUMN     "patientOrderId" INTEGER;

-- CreateTable
CREATE TABLE "ConsultationOrder" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "remark" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsultationOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingPatientOrderLineItem" (
    "id" SERIAL NOT NULL,
    "visitId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "billId" TEXT,

    CONSTRAINT "BillingPatientOrderLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingConsultationOrderLineItem" (
    "id" SERIAL NOT NULL,
    "visitId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "billId" TEXT,

    CONSTRAINT "BillingConsultationOrderLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "details" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "billId" TEXT,
    "reason" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "paid" DOUBLE PRECISION NOT NULL,
    "due" DOUBLE PRECISION NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_consultationOrderId_fkey" FOREIGN KEY ("consultationOrderId") REFERENCES "ConsultationOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationOrder" ADD CONSTRAINT "ConsultationOrder_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "PatientVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingPatientOrderLineItem" ADD CONSTRAINT "BillingPatientOrderLineItem_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "PatientVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingPatientOrderLineItem" ADD CONSTRAINT "BillingPatientOrderLineItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "PatientOrder"("visitId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingPatientOrderLineItem" ADD CONSTRAINT "BillingPatientOrderLineItem_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingConsultationOrderLineItem" ADD CONSTRAINT "BillingConsultationOrderLineItem_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "PatientVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingConsultationOrderLineItem" ADD CONSTRAINT "BillingConsultationOrderLineItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ConsultationOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingConsultationOrderLineItem" ADD CONSTRAINT "BillingConsultationOrderLineItem_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "PatientVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "PatientVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE SET NULL ON UPDATE CASCADE;
