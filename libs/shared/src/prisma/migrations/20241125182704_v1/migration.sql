/*
  Warnings:

  - You are about to drop the `Diagnosis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Diagnosis" DROP CONSTRAINT "Diagnosis_hospitalId_fkey";

-- DropTable
DROP TABLE "Diagnosis";
