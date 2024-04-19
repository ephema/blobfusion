/*
  Warnings:

  - You are about to drop the column `totalCost` on the `FusedBlob` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FusedBlob" DROP COLUMN "totalCost",
ADD COLUMN     "totalCostInGwei" BIGINT;
