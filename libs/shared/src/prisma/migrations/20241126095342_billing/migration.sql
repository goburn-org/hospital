/*
  Warnings:

  - Added the required column `cardAmount` to the `VisitBilling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cashAmount` to the `VisitBilling` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VisitBilling" ADD COLUMN     "cardAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "cashAmount" DOUBLE PRECISION NOT NULL;
