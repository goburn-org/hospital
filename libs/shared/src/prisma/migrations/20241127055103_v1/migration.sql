/*
  Warnings:

  - The `temperature` column on the `PatientVital` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `pulse` column on the `PatientVital` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bp` column on the `PatientVital` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `spo2` column on the `PatientVital` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PatientVital" DROP COLUMN "temperature",
ADD COLUMN     "temperature" JSONB[] DEFAULT ARRAY[]::JSONB[],
DROP COLUMN "pulse",
ADD COLUMN     "pulse" JSONB[] DEFAULT ARRAY[]::JSONB[],
DROP COLUMN "bp",
ADD COLUMN     "bp" JSONB[] DEFAULT ARRAY[]::JSONB[],
DROP COLUMN "spo2",
ADD COLUMN     "spo2" JSONB[] DEFAULT ARRAY[]::JSONB[];
