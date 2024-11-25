-- AddForeignKey
ALTER TABLE "PatientOrder" ADD CONSTRAINT "PatientOrder_uhid_fkey" FOREIGN KEY ("uhid") REFERENCES "Patient"("uhid") ON DELETE RESTRICT ON UPDATE CASCADE;
