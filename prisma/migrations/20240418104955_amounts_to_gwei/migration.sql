/*
  Warnings:

  - You are about to drop the column `amount` on the `Deposit` table. All the data in the column will be lost.
  - You are about to drop the column `bid` on the `PartialBlob` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `PartialBlob` table. All the data in the column will be lost.
  - Added the required column `valueInGwei` to the `Deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bidInGwei` to the `PartialBlob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deposit" DROP COLUMN "amount",
ADD COLUMN     "valueInGwei" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "PartialBlob" DROP COLUMN "bid",
DROP COLUMN "cost",
ADD COLUMN     "bidInGwei" BIGINT NOT NULL,
ADD COLUMN     "costInGwei" BIGINT;
