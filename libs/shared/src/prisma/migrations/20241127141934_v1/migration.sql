/*
  Warnings:

  - You are about to drop the `IntentStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IntentTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductIntent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IntentTrack" DROP CONSTRAINT "IntentTrack_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "IntentTrack" DROP CONSTRAINT "IntentTrack_statusId_fkey";

-- DropForeignKey
ALTER TABLE "ProductIntent" DROP CONSTRAINT "ProductIntent_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "ProductIntent" DROP CONSTRAINT "ProductIntent_intentId_fkey";

-- DropForeignKey
ALTER TABLE "ProductIntent" DROP CONSTRAINT "ProductIntent_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductIntent" DROP CONSTRAINT "ProductIntent_trackId_fkey";

-- DropTable
DROP TABLE "IntentStatus";

-- DropTable
DROP TABLE "IntentTrack";

-- DropTable
DROP TABLE "ProductIntent";
