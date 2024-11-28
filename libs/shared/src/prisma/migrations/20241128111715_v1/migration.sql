/*
  Warnings:

  - You are about to alter the column `baseAmount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `maxDiscount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.
  - You are about to alter the column `taxRate` on the `TaxCode` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "baseAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "maxDiscount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "TaxCode" ALTER COLUMN "taxRate" SET DATA TYPE DOUBLE PRECISION;
