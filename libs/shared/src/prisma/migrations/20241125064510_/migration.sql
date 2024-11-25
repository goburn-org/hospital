/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `PatientOrder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "PatientOrder" DROP CONSTRAINT "PatientOrder_doctorId_fkey";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "doctorId";

-- AlterTable
ALTER TABLE "PatientOrder" DROP COLUMN "doctorId";
