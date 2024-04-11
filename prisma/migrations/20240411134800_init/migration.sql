-- CreateTable
CREATE TABLE "User" (
    "address" TEXT NOT NULL,
    "deposits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "PartialBlob" (
    "id" SERIAL NOT NULL,
    "bid" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "fusedBlobId" INTEGER,
    "fusedBlobPosition" INTEGER,
    "cost" INTEGER,

    CONSTRAINT "PartialBlob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FusedBlob" (
    "id" SERIAL NOT NULL,
    "txHash" TEXT,
    "totalCost" INTEGER,

    CONSTRAINT "FusedBlob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PartialBlob" ADD CONSTRAINT "PartialBlob_fromAddress_fkey" FOREIGN KEY ("fromAddress") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartialBlob" ADD CONSTRAINT "PartialBlob_fusedBlobId_fkey" FOREIGN KEY ("fusedBlobId") REFERENCES "FusedBlob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
