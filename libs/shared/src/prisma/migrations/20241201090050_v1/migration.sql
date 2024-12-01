-- AlterTable
ALTER TABLE "Bill" ALTER COLUMN "hospitalId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "BillingConsultationOrderLineItem" ALTER COLUMN "hospitalId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "BillingPatientOrderLineItem" ALTER COLUMN "hospitalId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Receipt" ALTER COLUMN "hospitalId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "VisitBilling" ALTER COLUMN "hospitalId" DROP DEFAULT;
