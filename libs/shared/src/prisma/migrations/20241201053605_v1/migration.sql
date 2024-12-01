/*
  Warnings:

  - You are about to drop the column `due` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Receipt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "due",
DROP COLUMN "total",
ALTER COLUMN "items" DROP NOT NULL;
