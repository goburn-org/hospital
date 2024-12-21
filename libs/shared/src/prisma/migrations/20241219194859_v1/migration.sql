/*
  Warnings:

  - You are about to drop the column `fatherName` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "fatherName",
ADD COLUMN     "guardianName" TEXT;
