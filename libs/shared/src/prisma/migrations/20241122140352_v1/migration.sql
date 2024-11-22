-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "Patient" (
    "uhid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "mobile" TEXT NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "dob" TIMESTAMP(3),
    "bornYear" INTEGER,
    "aadharNumber" TEXT,
    "aadharName" TEXT,
    "bloodGroup" TEXT,
    "address" TEXT,
    "city" TEXT,
    "pincode" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("uhid")
);
