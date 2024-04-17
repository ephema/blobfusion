import { type Hex } from "viem";

import { prisma } from "@/api/prisma/client";

export const depositRepository = {
  createIfNeededAsync: async ({
    txHash,
    fromAddress,
    amount,
  }: {
    txHash: Hex;
    fromAddress: Hex;
    amount: bigint;
  }): Promise<number> => {
    const { id: depositId } = await prisma.deposit.upsert({
      where: { txHash },
      create: {
        txHash,
        amount,
        owner: {
          connectOrCreate: {
            where: { address: fromAddress },
            create: { address: fromAddress },
          },
        },
      },
      update: {},
      select: { id: true },
    });

    return depositId;
  },
};
