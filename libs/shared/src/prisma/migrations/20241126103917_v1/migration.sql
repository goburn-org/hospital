/*
  Warnings:

  - You are about to drop the column `details` on the `VisitBilling` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VisitBilling" DROP COLUMN "details",
ADD COLUMN     "items" JSONB;
