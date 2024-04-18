import { depositRepository } from "@/api/deposit/depositRepository";

import {
  type DepositEvent,
  subscribeToDepositEvents,
} from "./subscribeToDepositEvents";

const onDeposit = async ({ txHash, depositor, valueInGwei }: DepositEvent) => {
  await depositRepository.createIfNeededAsync({
    txHash,
    fromAddress: depositor,
    valueInGwei,
  });
};

export const unsubscribeFromDepositEvents = subscribeToDepositEvents({
  onDeposit,
});
