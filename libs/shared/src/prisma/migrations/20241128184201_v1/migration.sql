/*
  Warnings:

  - The `remark` column on the `PatientOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PatientOrder" DROP COLUMN "remark",
ADD COLUMN     "remark" JSONB;
