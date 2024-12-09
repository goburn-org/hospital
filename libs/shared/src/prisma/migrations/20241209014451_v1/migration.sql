/*
  Warnings:

  - You are about to drop the `VisitBilling` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VisitBilling" DROP CONSTRAINT "VisitBilling_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "VisitBilling" DROP CONSTRAINT "VisitBilling_visitId_fkey";

-- DropTable
DROP TABLE "VisitBilling";
