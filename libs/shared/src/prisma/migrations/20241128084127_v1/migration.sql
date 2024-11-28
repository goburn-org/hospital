/*
  Warnings:

  - You are about to drop the `OrderDepartment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_orderDeptId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDepartment" DROP CONSTRAINT "OrderDepartment_hospitalId_fkey";

-- DropTable
DROP TABLE "OrderDepartment";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderDeptId_fkey" FOREIGN KEY ("orderDeptId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
