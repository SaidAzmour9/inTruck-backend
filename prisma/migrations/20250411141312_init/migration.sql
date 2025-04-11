/*
  Warnings:

  - You are about to drop the column `date` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.
  - Added the required column `delivery_date` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickup_date` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipment_info` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipment_range` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `weight` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `price` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "date",
DROP COLUMN "location",
DROP COLUMN "status",
ADD COLUMN     "delivery_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "height" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "pickup_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "shipment_info" TEXT NOT NULL,
ADD COLUMN     "shipment_note" TEXT,
ADD COLUMN     "shipment_range" TEXT NOT NULL,
ADD COLUMN     "width" DECIMAL(65,30) NOT NULL,
DROP COLUMN "weight",
ADD COLUMN     "weight" DECIMAL(65,30) NOT NULL,
DROP COLUMN "price",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;
