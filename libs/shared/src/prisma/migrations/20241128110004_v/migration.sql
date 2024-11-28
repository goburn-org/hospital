/*
  Warnings:

  - You are about to drop the `UserFee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFee" DROP CONSTRAINT "UserFee_orderId_fkey";

-- DropForeignKey
ALTER TABLE "UserFee" DROP CONSTRAINT "UserFee_userId_fkey";

-- DropTable
DROP TABLE "UserFee";

-- CreateTable
CREATE TABLE "DoctorCut" (
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "flatFee" DOUBLE PRECISION NOT NULL,
    "percentFee" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "DoctorCut_userId_orderId_key" ON "DoctorCut"("userId", "orderId");

-- AddForeignKey
ALTER TABLE "DoctorCut" ADD CONSTRAINT "DoctorCut_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorCut" ADD CONSTRAINT "DoctorCut_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
