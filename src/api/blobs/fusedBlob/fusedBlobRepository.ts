import { type Hex } from "viem";

import { type PartialBlob } from "@/api/blobs/partialBlob/partialBlobModel";
import { prisma } from "@/api/prisma/client";
import { getLengthWithExtraBytes } from "@/blob-fuser";

import { convertPartialBlobInDBToPartialBlob } from "../partialBlob/convertPartialBlobInDBToPartialBlob";
import { type FusedBlob } from "./fusedBlobModel";

export const fusedBlobRepository = {
  findAllAsync: async ({ withDataAndSignature = true } = {}): Promise<
    FusedBlob[]
  > => {
    const fusedBlobsInDB = await prisma.fusedBlob.findMany({
      include: { partialBlobs: true },
    });

    return fusedBlobsInDB.map((fusedBlob) => ({
      ...fusedBlob,
      partialBlobs: fusedBlob.partialBlobs.map((partialBlob) => {
        const convertedPartialBlob =
          convertPartialBlobInDBToPartialBlob(partialBlob);

        if (withDataAndSignature) {
          return convertedPartialBlob;
        }

        return {
          ...convertedPartialBlob,
          data: null,
          signature: null,
          size: getLengthWithExtraBytes(convertedPartialBlob.data),
        };
      }),
    }));
  },
  createAsync: async ({
    blobIds,
  }: {
    blobIds: PartialBlob["id"][];
  }): Promise<number> => {
    const { id: fusedBlobId } = await prisma.fusedBlob.create({
      data: {},
      select: { id: true },
    });

    // TODO: also update fusedBlobPosition or remove it
    await prisma.partialBlob.updateMany({
      where: { id: { in: blobIds } },
      data: { fusedBlobId },
    });

    return fusedBlobId;
  },

  updateTxHash: async ({
    id,
    txHash,
  }: {
    id: number;
    txHash: Hex;
  }): Promise<void> => {
    // TODO: Also update totalCost
    await prisma.fusedBlob.update({
      where: { id },
      data: { txHash },
      select: { id: true },
    });
  },
};
