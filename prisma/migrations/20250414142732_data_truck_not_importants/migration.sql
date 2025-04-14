-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_truckId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "truckId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE SET NULL ON UPDATE CASCADE;
