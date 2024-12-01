-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'CARD');

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL DEFAULT 'CARD';
