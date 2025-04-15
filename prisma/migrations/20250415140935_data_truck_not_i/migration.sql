/*
  Warnings:

  - You are about to drop the column `date` on the `Tracking` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Tracking` table. All the data in the column will be lost.
  - Added the required column `paymenetMethod` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymenetMethod" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tracking" DROP COLUMN "date",
DROP COLUMN "location";

-- AlterTable
ALTER TABLE "Truck" ALTER COLUMN "driverId" DROP NOT NULL,
ALTER COLUMN "capacity" DROP NOT NULL;
