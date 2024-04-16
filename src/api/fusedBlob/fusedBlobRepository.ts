import { type Hex } from "viem";

import { type PartialBlob } from "@/api/partialBlob/partialBlobModel";
import { prisma } from "@/api/prisma/client";

export const fusedBlobRepository = {
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
      select: {},
    });
  },
};
