/*
  Warnings:

  - You are about to drop the column `deposits` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "deposits";

-- CreateTable
CREATE TABLE "Deposit" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_txHash_key" ON "Deposit"("txHash");

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_fromAddress_fkey" FOREIGN KEY ("fromAddress") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
