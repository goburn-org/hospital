/*
  Warnings:

  - Made the column `hospitalImg` on table `Hospital` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Hospital" ALTER COLUMN "hospitalImg" SET NOT NULL;
