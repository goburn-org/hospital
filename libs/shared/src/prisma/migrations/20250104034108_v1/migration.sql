/*
  Warnings:

  - Added the required column `createdBy` to the `GRN` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GRN" ADD COLUMN     "createdBy" TEXT NOT NULL;
