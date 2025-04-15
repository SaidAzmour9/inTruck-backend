-- DropForeignKey
ALTER TABLE "Tracking" DROP CONSTRAINT "Tracking_truckId_fkey";

-- AlterTable
ALTER TABLE "Tracking" ALTER COLUMN "truckId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE SET NULL ON UPDATE CASCADE;
