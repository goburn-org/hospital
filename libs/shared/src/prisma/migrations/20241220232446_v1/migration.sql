/*
  Warnings:

  - You are about to drop the column `lastVisit` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "lastVisit",
ADD COLUMN     "lastVisitAt" TIMESTAMP(3);
