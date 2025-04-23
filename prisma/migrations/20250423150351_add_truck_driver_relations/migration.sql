/*
  Warnings:

  - A unique constraint covering the columns `[driverId]` on the table `Truck` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Truck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Truck" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "driverId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "licenseExpire" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Truck_driverId_key" ON "Truck"("driverId");

-- AddForeignKey
ALTER TABLE "Truck" ADD CONSTRAINT "Truck_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
