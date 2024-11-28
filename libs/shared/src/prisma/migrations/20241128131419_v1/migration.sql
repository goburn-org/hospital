/*
  Warnings:

  - You are about to drop the `ProductDepartment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductDepartment" DROP CONSTRAINT "ProductDepartment_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDepartment" DROP CONSTRAINT "ProductDepartment_productId_fkey";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "productId" TEXT;

-- DropTable
DROP TABLE "ProductDepartment";

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
