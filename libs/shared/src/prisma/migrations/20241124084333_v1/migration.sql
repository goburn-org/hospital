/*
  Warnings:

  - The primary key for the `Assessment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Assessment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_pkey",
DROP COLUMN "id",
DROP COLUMN "isDeleted",
ALTER COLUMN "complaint" DROP NOT NULL,
ALTER COLUMN "currentMedication" DROP NOT NULL,
ALTER COLUMN "pastMedicalHistory" DROP NOT NULL,
ALTER COLUMN "examination" DROP NOT NULL,
ALTER COLUMN "investigation" DROP NOT NULL,
ALTER COLUMN "procedureDone" DROP NOT NULL,
ALTER COLUMN "diagnosis" DROP NOT NULL,
ALTER COLUMN "treatmentGiven" DROP NOT NULL,
ALTER COLUMN "followUp" DROP NOT NULL,
ALTER COLUMN "followupInstruction" DROP NOT NULL;
