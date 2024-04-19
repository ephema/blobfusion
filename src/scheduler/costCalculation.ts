import { toBytes } from "viem";

import { PartialBlob } from "@/api/partialBlob/partialBlobModel";
import {
  BLOB_DATA_SIZE_LENGTH_IN_BYTES,
  SIGNATURE_LENGTH_IN_BYTES,
} from "@/common/constants";

import { schedulerLogger } from "./logger";

export const calculateTotalTxCost = ({
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

export const calculateCostPerPartialBlob = ({
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
      Math.ceil((blob.dataLength / totalDataLength) * 10000),
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
      "Summed cost of partial blobs (%d gwei) is less than total cost of tx (%d gwei)",
      totalCostOfPartialBlobs,
      totalCostInGwei,
    );
  }

  return partialBlobsWithCost;
};
