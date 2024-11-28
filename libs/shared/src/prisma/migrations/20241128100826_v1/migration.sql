/*
  Warnings:

  - Added the required column `baseAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consultationRequired` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxCodeId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_departmentId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "baseAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "consultationRequired" BOOLEAN NOT NULL,
ADD COLUMN     "maxDiscount" DECIMAL(5,2),
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "taxCodeId" INTEGER NOT NULL,
ALTER COLUMN "departmentId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserFee" (
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "flatFee" DOUBLE PRECISION NOT NULL,
    "percentFee" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT
);

-- CreateTable
CREATE TABLE "TaxCode" (
    "id" SERIAL NOT NULL,
    "taxCode" TEXT NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL,
    "description" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFee_userId_orderId_key" ON "UserFee"("userId", "orderId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_taxCodeId_fkey" FOREIGN KEY ("taxCodeId") REFERENCES "TaxCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFee" ADD CONSTRAINT "UserFee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFee" ADD CONSTRAINT "UserFee_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
