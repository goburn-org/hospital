-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "uOMId" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "SKU" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "mrp" DOUBLE PRECISION NOT NULL,
    "salePrice" DOUBLE PRECISION NOT NULL,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SKU_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounterSale" (
    "id" TEXT NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CounterSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounterItem" (
    "id" TEXT NOT NULL,
    "counterSaleId" TEXT NOT NULL,
    "skuId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT,

    CONSTRAINT "CounterItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SKU" ADD CONSTRAINT "SKU_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SKU" ADD CONSTRAINT "SKU_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounterSale" ADD CONSTRAINT "CounterSale_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounterItem" ADD CONSTRAINT "CounterItem_counterSaleId_fkey" FOREIGN KEY ("counterSaleId") REFERENCES "CounterSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounterItem" ADD CONSTRAINT "CounterItem_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "SKU"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounterItem" ADD CONSTRAINT "CounterItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
