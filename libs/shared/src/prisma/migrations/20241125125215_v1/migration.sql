-- CreateTable
CREATE TABLE "PatientPrescription" (
    "visitId" TEXT NOT NULL,
    "list" JSONB NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientPrescription_visitId_key" ON "PatientPrescription"("visitId");

-- AddForeignKey
ALTER TABLE "PatientPrescription" ADD CONSTRAINT "PatientPrescription_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "PatientVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
