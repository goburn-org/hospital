/*
  Warnings:

  - Added the required column `hospitalId` to the `TaxCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaxCode" ADD COLUMN     "hospitalId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TaxCode" ADD CONSTRAINT "TaxCode_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
