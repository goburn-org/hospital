-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "branded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "chargeHead" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "scheduleDrugType" TEXT,
ADD COLUMN     "uOMId" INTEGER,
ADD COLUMN     "uom" INTEGER;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_uOMId_fkey" FOREIGN KEY ("uOMId") REFERENCES "UOM"("id") ON DELETE SET NULL ON UPDATE CASCADE;
