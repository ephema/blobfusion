import { PartialBlob } from "@/api/partialBlob/partialBlobModel";
import {
  GAS_PER_BLOB,
  GAS_PER_TX,
  MAX_BLOB_SIZE_IN_BYTES,
} from "@/common/constants";
import { getBlobGasEstimate } from "@/ethereum/gas/estimateBlobGas";
import { getCurrentGasPrice } from "@/ethereum/gas/getCurrentGasPrice";

import {
  calculateCostPerPartialBlob,
  calculateTotalTxCost,
} from "./costCalculation";

export const getPotentialBlobConfiguration = async (
  partialBlobs: PartialBlob[],
) => {
  const blobGasEstimate = await getBlobGasEstimate();

  const totalTransactionCost = calculateTotalTxCost({
    blobGasPrice: blobGasEstimate,
    blobGasUsed: GAS_PER_BLOB,
    gasUsed: GAS_PER_TX,
    effectiveGasPrice: await getCurrentGasPrice(),
  });

  return buildFusedBlobConfiguration({ partialBlobs, totalTransactionCost });
};

// Blob Building is a variant of the Knapsack Problem, which is NP-Hard.
// There are efficient solutions, which we want to look into soon.
//
// For now, we try to keep the algorithm as simple as possible. It tries to
// submit as many blobs as possible by first starting at all unfused blobs, and then
// iteratively removes blobs that either don't fit anymore or whose bid is too low.
//
// So we can submit a FusedBlob once two conditions are satisfied:
// 1. The length of the FusedBlob is less than or equal to MAX_BLOB_SIZE_IN_BYTES
// 2. Each PartialBlob's bid in the FusedBlob is greater than its cost
export const buildFusedBlobConfiguration = ({
  partialBlobs,
  totalTransactionCost,
}: {
  partialBlobs: PartialBlob[];
  totalTransactionCost: bigint;
}) => {
  let done = false;
  let selectedPartialBlobs = partialBlobs;
  while (!done) {
    const selectedPartialBlobsWithCost = calculateCostPerPartialBlob({
      totalCostInGwei: totalTransactionCost,
      partialBlobs: selectedPartialBlobs,
    });

    const newSelectedPartialBlobs = selectedPartialBlobsWithCost.filter(
      (partialBlob) => partialBlob.costInGwei > partialBlob.bidInGwei,
    );

    const noBlobsLeft = newSelectedPartialBlobs.length === 0;
    if (noBlobsLeft) {
      done = true;
    }

    const totalLength = newSelectedPartialBlobs.reduce(
      (acc, partialBlob) => acc + partialBlob.dataLength,
      0,
    );

    const noBlobsRemoved =
      newSelectedPartialBlobs.length === selectedPartialBlobs.length;
    const fusedBlobIsTooBig = totalLength > MAX_BLOB_SIZE_IN_BYTES;
    if (noBlobsRemoved && !fusedBlobIsTooBig) {
      done = true;
    }

    // TODO add case where we remove a blob when the size constraint doesn't work anymore

    selectedPartialBlobs = newSelectedPartialBlobs;
  }

  return selectedPartialBlobs;
};
