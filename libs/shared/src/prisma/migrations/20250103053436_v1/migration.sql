/*
  Warnings:

  - You are about to drop the column `chargeHead` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `mrp` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseRate` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `saleRate` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "chargeHead",
DROP COLUMN "mrp",
DROP COLUMN "purchaseRate",
DROP COLUMN "saleRate";
