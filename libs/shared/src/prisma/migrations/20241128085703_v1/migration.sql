/*
  Warnings:

  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- AlterTable
ALTER TABLE "Department" ALTER COLUMN "roleId" DROP NOT NULL;

-- DropTable
DROP TABLE "UserRole";

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
