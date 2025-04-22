/*
  Warnings:

  - The `status` column on the `Truck` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `amount` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "reason" TEXT,
ADD COLUMN     "status" "TrackingStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amount",
ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "Truck" ADD COLUMN     "location" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "TruckStatus" NOT NULL DEFAULT 'AVAILABLE';
