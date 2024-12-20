/*
  Warnings:

  - You are about to drop the column `doctorIds` on the `PatientOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PatientOrder" DROP COLUMN "doctorIds",
ADD COLUMN     "orderToDoctor" JSONB;
