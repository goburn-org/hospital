-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
