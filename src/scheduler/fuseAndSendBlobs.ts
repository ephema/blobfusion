import { Hex, toBytes } from "viem";

import { fusedBlobRepository } from "@/api/fusedBlob/fusedBlobRepository";
import { PartialBlob } from "@/api/partialBlob/partialBlobModel";
import { partialBlobRepository } from "@/api/partialBlob/partialBlobRepository";
import { prisma } from "@/api/prisma/client";
import { fusePartialBlobs } from "@/blob-fuser";
import {
  BLOB_DATA_SIZE_LENGTH_IN_BYTES,
  SIGNATURE_LENGTH_IN_BYTES,
} from "@/common/constants";
import { sendBlobTransaction } from "@/ethereum/sendBlobTransaction";
import { blobSubmitterPublicClient } from "@/ethereum/viemClients";

import { schedulerLogger } from "./logger";

// TODO: Add tests
export const fuseAndSendBlobs = async () => {
  schedulerLogger.info("Attempting to fuse and send new blob");

  const partialBlobs = await partialBlobRepository.findAllUnfusedAsync();

  schedulerLogger.info("%d unfused partial blobs found", partialBlobs.length);

  const blobsToFuse = getPotentialBlobConfiguration(partialBlobs);
  if (!blobsToFuse) {
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

// TODO
const getPotentialBlobConfiguration = (partialBlobs: PartialBlob[]) => {
  if (!canFuseBlobs(partialBlobs)) {
    return null;
  }

  return partialBlobs;
};

// TODO
const canFuseBlobs = (partialBlobs: PartialBlob[]) => {
  return partialBlobs.length >= 2;
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

const calculateTotalTxCost = ({
  blobGasPrice,
  blobGasUsed,
  gasUsed,
  effectiveGasPrice,
}: {
  blobGasPrice: bigint;
  blobGasUsed: bigint;
  gasUsed: bigint;
  effectiveGasPrice: bigint;
}) => {
  const blobCost = blobGasPrice * blobGasUsed;
  const callDataCost = effectiveGasPrice * gasUsed;
  const totalCostInWei = blobCost + callDataCost;

  // XXX: Limiting the precision to gwei for now because the
  // Postgres bigint datatype is too small to store full wei balances
  // So we are using gwei as the smallest unit here, but of course we should
  // find a better solution for this in the future
  const shouldAddOneGweiForRoundingError = totalCostInWei % BigInt(1e9) > 0n;
  const costInGwei = totalCostInWei / BigInt(1e9);
  const totalCostInGwei =
    costInGwei + (shouldAddOneGweiForRoundingError ? 1n : 0n);

  return totalCostInGwei;
};

const calculateCostPerPartialBlob = ({
  totalCostInGwei,
  partialBlobs,
}: {
  totalCostInGwei: bigint;
  partialBlobs: PartialBlob[];
}) => {
  const partialBlobsWithLength = partialBlobs.map((blob) => ({
    ...blob,
    dataLength:
      SIGNATURE_LENGTH_IN_BYTES +
      BLOB_DATA_SIZE_LENGTH_IN_BYTES +
      toBytes(blob.data).length,
  }));

  const totalDataLength = partialBlobsWithLength.reduce(
    (acc, blob) => acc + blob.dataLength,
    0,
  );

  const partialBlobsWithCost = partialBlobsWithLength.map((blob) => {
    // Because we are using BigInts, we need to convert the division result to BigInt
    // first and then multiply it with the totalCostInGwei. To lose precision as late
    // as possible we multiply with 10000 first and then divide by it again as the last step.
    const relativeDataLength = BigInt(
      (blob.dataLength / totalDataLength) * 10000,
    );

    const costInGwei = (relativeDataLength * totalCostInGwei) / 10000n;

    return {
      ...blob,
      costInGwei,
    };
  });

  const totalCostOfPartialBlobs = partialBlobsWithCost.reduce(
    (acc, blob) => acc + blob.costInGwei,
    0n,
  );

  if (totalCostOfPartialBlobs < totalCostInGwei) {
    schedulerLogger.warn(
      "Total cost of partial blobs (%d gwei) is less than total cost of tx (%d gwei)",
      totalCostOfPartialBlobs,
      totalCostInGwei,
    );
  }

  return partialBlobsWithCost;
};
