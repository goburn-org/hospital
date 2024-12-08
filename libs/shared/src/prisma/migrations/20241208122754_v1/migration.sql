-- CreateTable
CREATE TABLE "BankAccount" (
    "hospitalId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);
