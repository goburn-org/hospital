/*
  Warnings:

  - You are about to drop the column `followUp` on the `Assessment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "followUp",
ADD COLUMN     "advice" TEXT,
ADD COLUMN     "followUpDate" TIMESTAMP(3);
