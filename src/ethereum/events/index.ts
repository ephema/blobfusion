import { depositRepository } from "@/api/deposit/depositRepository";

import {
  type DepositEvent,
  subscribeToDepositEvents,
} from "./subscribeToDepositEvents";

const onDeposit = async ({ txHash, depositor, amount }: DepositEvent) => {
  await depositRepository.createIfNeededAsync({
    txHash,
    fromAddress: depositor,
    amount,
  });
};

export const unsubscribeFromDepositEvents = subscribeToDepositEvents({
  onDeposit,
});
