/*
  Warnings:

  - Added the required column `hospitalId` to the `Diagnosis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Diagnosis" ADD COLUMN     "hospitalId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
