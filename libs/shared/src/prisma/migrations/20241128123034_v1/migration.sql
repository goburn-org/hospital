-- CreateTable
CREATE TABLE "OrderGroups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "hospitalId" INTEGER NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderGroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderGroups-Order" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderGroups-Order_AB_unique" ON "_OrderGroups-Order"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderGroups-Order_B_index" ON "_OrderGroups-Order"("B");

-- AddForeignKey
ALTER TABLE "OrderGroups" ADD CONSTRAINT "OrderGroups_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderGroups-Order" ADD CONSTRAINT "_OrderGroups-Order_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderGroups-Order" ADD CONSTRAINT "_OrderGroups-Order_B_fkey" FOREIGN KEY ("B") REFERENCES "OrderGroups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
