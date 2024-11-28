/*
  Warnings:

  - You are about to drop the column `orderDeptId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `departmentId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_orderDeptId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderDeptId",
ADD COLUMN     "departmentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
