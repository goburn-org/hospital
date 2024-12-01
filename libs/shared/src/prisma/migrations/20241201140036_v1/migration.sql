/*
  Warnings:

  - You are about to drop the column `patientOrderVisitId` on the `BillingPatientOrderLineItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BillingPatientOrderLineItem" DROP CONSTRAINT "BillingPatientOrderLineItem_patientOrderVisitId_fkey";

-- AlterTable
ALTER TABLE "BillingPatientOrderLineItem" DROP COLUMN "patientOrderVisitId";
