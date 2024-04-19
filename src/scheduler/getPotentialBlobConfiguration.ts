import { PartialBlob } from "@/api/partialBlob/partialBlobModel";
import { GAS_PER_BLOB, GAS_PER_TX } from "@/common/constants";
import { getBlobGasEstimate } from "@/ethereum/estimateBlobGas";
import { blobSubmitterPublicClient } from "@/ethereum/viemClients";

import {
  calculateCostPerPartialBlob,
  calculateTotalTxCost,
} from "./costCalculation";

// TODO
export const getPotentialBlobConfiguration = async (
  partialBlobs: PartialBlob[],
) => {
  if (!canFuseBlobs(partialBlobs)) {
    return null;
  }

  const blobGasEstimate = await getBlobGasEstimate();

  const totalTransactionCost = calculateTotalTxCost({
    blobGasPrice: blobGasEstimate,
    blobGasUsed: GAS_PER_BLOB,
    gasUsed: GAS_PER_TX,
    effectiveGasPrice: await getCurrentGasPrice(),
  });

  const partialBlobsCost = calculateCostPerPartialBlob({
    totalCostInGwei: totalTransactionCost,
    partialBlobs,
  });

  // TODO: How can I use bin packing or knapsack to do this?
  // Is there an easy way to optimally fill a blob?
  // Also have to consider MAX_SIZE, i.e. don't fill too many
  // blobs
  if (
    partialBlobsCost.some(
      (partialBlob) => partialBlob.costInGwei > partialBlob.bidInGwei,
    )
  ) {
    return null;
  }

  return partialBlobs;
};

const getCurrentGasPrice = () => blobSubmitterPublicClient.getGasPrice();

// TODO
export const canFuseBlobs = (partialBlobs: PartialBlob[]) => {
  return partialBlobs.length >= 2;
};
