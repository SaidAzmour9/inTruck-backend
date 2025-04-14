/*
  Warnings:

  - Added the required column `delivery_city` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickup_city` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "delivery_city" TEXT NOT NULL,
ADD COLUMN     "pickup_city" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userType" SET DEFAULT 'INDIVIDUAL';
