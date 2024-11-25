/*
  Warnings:

  - You are about to drop the column `uhid` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `uhid` on the `PatientOrder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_uhid_fkey";

-- DropForeignKey
ALTER TABLE "PatientOrder" DROP CONSTRAINT "PatientOrder_uhid_fkey";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "uhid";

-- AlterTable
ALTER TABLE "PatientOrder" DROP COLUMN "uhid";
