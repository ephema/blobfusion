import { Hex } from "viem";

import { fusedBlobRepository } from "@/api/blobs/fusedBlob/fusedBlobRepository";
import { PartialBlob } from "@/api/blobs/partialBlob/partialBlobModel";
import { partialBlobRepository } from "@/api/blobs/partialBlob/partialBlobRepository";
import { prisma } from "@/api/prisma/client";
import { fusePartialBlobs } from "@/blob-fuser";
import { sendBlobTransaction } from "@/ethereum/sendBlobTransaction";
import { blobSubmitterPublicClient } from "@/ethereum/viemClients";

import {
  calculateCostPerPartialBlob,
  calculateTotalTxCost,
} from "./costCalculation";
import { getPotentialBlobConfiguration } from "./getPotentialBlobConfiguration";
import { schedulerLogger } from "./logger";

// TODO: Add tests
export const fuseAndSendBlobs = async () => {
  schedulerLogger.info("Attempting to fuse and send new blob");

  const partialBlobs = await partialBlobRepository.findAllUnfusedAsync();

  schedulerLogger.info("%d unfused partial blobs found", partialBlobs.length);

  const blobsToFuse = await getPotentialBlobConfiguration(partialBlobs);
  if (blobsToFuse.length === 0) {
    schedulerLogger.info(
      "Didn't find configuration to fuse partial blobs. Waiting for more blobs to be submitted",
    );
    return;
  }

  const fusedBlob = fusePartialBlobs(blobsToFuse);
  const partialBlobIds = blobsToFuse.map((blob) => blob.id);

  // TODO: Also update fusedBlobPosition
  const fusedBlobId = await fusedBlobRepository.createAsync({
    blobIds: partialBlobIds,
  });

  schedulerLogger.info("Created new fused blob with id %d", fusedBlobId);

  // TODO: error handling if tx fails
  const txHash = await sendBlobTransaction({ data: fusedBlob });
  // TODO: deduct balances
  await fusedBlobRepository.updateTxHash({ id: fusedBlobId, txHash });
  schedulerLogger.info("Fused blob tx submitted with txHash %s", txHash);

  waitForTransactionReceiptAndUpdateCost({
    txHash,
    fusedBlobId,
    partialBlobs: blobsToFuse,
  });

  return txHash;
};

const waitForTransactionReceiptAndUpdateCost = async ({
  txHash,
  fusedBlobId,
  partialBlobs,
}: {
  txHash: Hex;
  fusedBlobId: number;
  partialBlobs: PartialBlob[];
}) => {
  schedulerLogger.info("Querying txReceipt for %s", txHash);

  try {
    const receipt = await blobSubmitterPublicClient.waitForTransactionReceipt({
      hash: txHash,
      pollingInterval: 2000,
      retryDelay: 5000,
    });

    schedulerLogger.info("txReceipt received for %s...", txHash);

    const { blobGasPrice, blobGasUsed, gasUsed, effectiveGasPrice, status } =
      receipt;

    if (status === "reverted") {
      schedulerLogger.error(receipt, "Transaction was reverted");
      throw new Error("Transaction was reverted");
    }

    if (!blobGasPrice || !blobGasUsed) {
      schedulerLogger.error(
        "Blob gas data is missing from receipt of tx %s",
        txHash,
      );

      throw new Error("Blob gas data is missing from receipt");
    }

    const totalCostInGwei = calculateTotalTxCost({
      blobGasPrice,
      blobGasUsed,
      gasUsed,
      effectiveGasPrice,
    });

    const costPerPartialBlob = calculateCostPerPartialBlob({
      totalCostInGwei,
      partialBlobs,
    });

    await prisma.fusedBlob.update({
      where: { id: fusedBlobId },
      data: {
        totalCostInGwei,
        partialBlobs: {
          updateMany: costPerPartialBlob.map((blob) => ({
            where: { id: blob.id },
            data: { costInGwei: blob.costInGwei },
          })),
        },
      },
    });
  } catch (error) {
    // TODO: Handle errors correctly
    schedulerLogger.error(
      error,
      "Couldn't get the txReceipt for fusedBlob with txHash %s",
      txHash,
    );
  }
};
