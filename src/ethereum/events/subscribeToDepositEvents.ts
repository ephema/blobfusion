import { Hex, parseAbiItem } from "viem";

import { logger } from "@/common/logger";
import { env } from "@/common/utils/envConfig";

import { depositContractPublicClient } from "../viemClients";

export type DepositEvent = {
  txHash: Hex;
  depositor: Hex;
  valueInGwei: bigint;
};

export const subscribeToDepositEvents = ({
  onDeposit,
}: {
  onDeposit: (event: DepositEvent) => void;
}) => {
  const unwatch = depositContractPublicClient.watchEvent({
    address: env.DEPOSIT_CONTRACT_ADDRESS,
    event: parseAbiItem("event Deposit(address depositor, uint256 amount)"),
    onError: logger.error,
    onLogs: (logs) => {
      logs.forEach((log) => {
        const { args, transactionHash } = log;
        const { depositor, amount } = args;
        if (!depositor || !amount) {
          logger.error(
            "Received an event without depositor or amount field. Depositor: %s, amount, %d",
            args.depositor,
            args.amount,
          );

          return;
        }

        logger.info(
          "New Deposit event from %s of value %d",
          args.depositor,
          args.amount,
        );

        onDeposit({ txHash: transactionHash, depositor, valueInGwei: amount });
      });
    },
  });

  return unwatch;
};
