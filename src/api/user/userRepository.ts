import { type Hex } from "viem";

import { prisma } from "@/api/prisma/client";
import { logger } from "@/common/logger";

export const userRepository = {
  getBalance: async ({ address }: { address: Hex }): Promise<bigint> => {
    const depositResult = await prisma.deposit.groupBy({
      by: ["fromAddress"],
      where: { fromAddress: address },
      _sum: {
        amount: true,
      },
    });

    const userDeposits = depositResult?.[0]?._sum.amount ?? 0n;

    // TODO: There could be a race condition hiding here
    // if a user submitted a blob (i.e. has a fusedBlobId) but
    // the cost has not been calculated yet (which should happen
    // after the tx was successfully sent)
    const partialBlobCostResult = await prisma.partialBlob.groupBy({
      by: ["fromAddress"],
      where: { fromAddress: address, fusedBlobId: { not: null } },
      _sum: {
        cost: true,
      },
    });

    const userCosts = partialBlobCostResult?.[0]?._sum.cost ?? 0n;

    const balance = userDeposits - userCosts;

    if (balance < 0n) {
      logger.warn("User %s has negative balance of %d", address, balance);
    }

    return balance;
  },
};
