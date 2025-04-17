/*
  Warnings:

  - You are about to drop the column `carrier` on the `Truck` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Truck` table. All the data in the column will be lost.
  - You are about to drop the column `driverId` on the `Truck` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Truck` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Truck` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Truck` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[truckNumber]` on the table `Truck` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `model` to the `Truck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technicalDate` to the `Truck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `truckNumber` to the `Truck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `truckType` to the `Truck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `truckYear` to the `Truck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `Truck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Truck" DROP COLUMN "carrier",
DROP COLUMN "createdAt",
DROP COLUMN "driverId",
DROP COLUMN "location",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "technicalDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "truckNumber" TEXT NOT NULL,
ADD COLUMN     "truckType" TEXT NOT NULL,
ADD COLUMN     "truckYear" INTEGER NOT NULL,
DROP COLUMN "capacity",
ADD COLUMN     "capacity" DECIMAL(10,2) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Truck_truckNumber_key" ON "Truck"("truckNumber");
