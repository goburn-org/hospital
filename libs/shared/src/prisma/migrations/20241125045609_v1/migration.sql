/*
  Warnings:

  - The primary key for the `Diagnosis` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Diagnosis" DROP CONSTRAINT "Diagnosis_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Diagnosis_id_seq";
