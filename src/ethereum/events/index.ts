import { depositRepository } from "@/api/deposit/depositRepository";
import { logger } from "@/common/logger";

import {
  type DepositEvent,
  subscribeToDepositEvents,
} from "./subscribeToDepositEvents";

const ONE_GWEI_IN_WEI = 1000000000n;
const onDeposit = async ({ txHash, depositor, amount }: DepositEvent) => {
  const valueInGwei = amount / ONE_GWEI_IN_WEI; // BigInts are integers, so no rounding of fractions needed

  if (valueInGwei <= 0n) {
    logger.error(
      "Transaction %s has a value of less than one gwei. Skip it. Value in wei: %d",
      txHash,
      amount,
    );

    return;
  }
  await depositRepository.createIfNeededAsync({
    txHash,
    fromAddress: depositor,
    valueInGwei,
  });
};

export const unsubscribeFromDepositEvents = subscribeToDepositEvents({
  onDeposit,
});
