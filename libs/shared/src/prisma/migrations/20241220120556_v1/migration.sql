/*
  Warnings:

  - You are about to drop the column `doctorId` on the `PatientVisit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PatientVisit" DROP CONSTRAINT "PatientVisit_doctorId_fkey";

-- AlterTable
ALTER TABLE "PatientVisit" DROP COLUMN "doctorId";
