-- CreateTable
CREATE TABLE "VisitBilling" (
    "visitId" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitBilling_visitId_key" ON "VisitBilling"("visitId");

-- AddForeignKey
ALTER TABLE "VisitBilling" ADD CONSTRAINT "VisitBilling_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "PatientVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
