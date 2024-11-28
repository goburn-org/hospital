/*
  Warnings:

  - Added the required column `taxCodeId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "taxCodeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_taxCodeId_fkey" FOREIGN KEY ("taxCodeId") REFERENCES "TaxCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
