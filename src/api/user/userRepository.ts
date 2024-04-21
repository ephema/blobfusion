import { type Hex } from "viem";

import { prisma } from "@/api/prisma/client";
import { logger } from "@/common/logger";

export const userRepository = {
  // XXX: To keep things simple, user balance is defined as:
  // User balance = sum of deposits - (sum of costs + sum of bids for unfused blobs)
  getBalance: async ({ address }: { address: Hex }): Promise<bigint> => {
    const depositResult = await prisma.deposit.groupBy({
      by: ["fromAddress"],
      where: { fromAddress: address },
      _sum: {
        valueInGwei: true,
      },
    });

    if (depositResult.length === 0) {
      return 0n;
    }

    const userDeposits = depositResult?.[0]?._sum.valueInGwei ?? 0n;

    // TODO: There could be a race condition hiding here
    // if a user submitted a blob (i.e. has a fusedBlobId) but
    // the cost has not been calculated yet (which should happen
    // after the tx was successfully sent)
    // So for now we'll use the existence of fusedBlobId as a proxy
    const partialBlobCostResult = await prisma.partialBlob.groupBy({
      by: ["fromAddress"],
      where: { fromAddress: address, fusedBlobId: { not: null } },
      _sum: {
        costInGwei: true,
      },
    });

    const openBidsResult = await prisma.partialBlob.groupBy({
      by: ["fromAddress"],
      where: { fromAddress: address, fusedBlobId: null },
      _sum: {
        bidInGwei: true,
      },
    });

    const userCosts = partialBlobCostResult?.[0]?._sum.costInGwei ?? 0n;
    const openBids = openBidsResult?.[0]?._sum.bidInGwei ?? 0n;

    const balance = userDeposits - (userCosts + openBids);

    if (balance < 0n) {
      logger.warn("User %s has negative balance of %d", address, balance);
    }

    return balance;
  },
};
