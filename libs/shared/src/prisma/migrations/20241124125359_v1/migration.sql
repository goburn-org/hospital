/*
  Warnings:

  - You are about to drop the column `patientVisitId` on the `Assessment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[visitId]` on the table `Assessment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `visitId` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_patientVisitId_fkey";

-- DropIndex
DROP INDEX "Assessment_patientVisitId_key";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "patientVisitId",
ADD COLUMN     "visitId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_visitId_key" ON "Assessment"("visitId");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "PatientVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
