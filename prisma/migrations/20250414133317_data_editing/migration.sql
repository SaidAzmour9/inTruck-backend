/*
  Warnings:

  - You are about to drop the column `delivery_city` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pickup_city` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "delivery_city",
DROP COLUMN "pickup_city";
