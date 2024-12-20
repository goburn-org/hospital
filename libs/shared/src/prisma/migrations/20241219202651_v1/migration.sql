/*
  Warnings:

  - You are about to drop the column `bloodGroup` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `guardianName` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "bloodGroup",
DROP COLUMN "city",
DROP COLUMN "guardianName",
ADD COLUMN     "area" TEXT;

-- AlterTable
ALTER TABLE "PatientVisit" ADD COLUMN     "guardianMobile" TEXT,
ADD COLUMN     "guardianName" TEXT;
