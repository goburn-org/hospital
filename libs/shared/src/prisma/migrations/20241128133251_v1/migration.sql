-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "genericName" DROP NOT NULL,
ALTER COLUMN "brandName" DROP NOT NULL,
ALTER COLUMN "manufacturer" DROP NOT NULL,
ALTER COLUMN "dosageForm" DROP NOT NULL,
ALTER COLUMN "strength" DROP NOT NULL;
