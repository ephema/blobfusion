import { PartialBlob } from "@/api/blobs/partialBlob/partialBlobModel";
import {
  GAS_PER_BLOB,
  GAS_PER_TX,
  MAX_BLOB_SIZE_IN_BYTES,
} from "@/common/constants";
import { getBlobGasPriceEstimate } from "@/ethereum/gas/getBlobGasPriceEstimate";
import { getCurrentGasPrice } from "@/ethereum/gas/getCurrentGasPrice";

import {
  calculateCostPerPartialBlob,
  calculateTotalTxCost,
} from "./costCalculation";
import { schedulerLogger } from "./logger";

export const getPotentialBlobConfiguration = async (
  partialBlobs: PartialBlob[],
) => {
  const blobGasEstimate = await getBlobGasPriceEstimate();

  const totalCostInGwei = calculateTotalTxCost({
    blobGasPrice: blobGasEstimate,
    blobGasUsed: GAS_PER_BLOB,
    gasUsed: GAS_PER_TX,
    effectiveGasPrice: await getCurrentGasPrice(),
  });

  schedulerLogger.info(
    "Current estimated txCost for one blob is %s gwei",
    totalCostInGwei,
  );

  return buildFusedBlobConfiguration({
    partialBlobs,
    totalCostInGwei,
  });
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
  totalCostInGwei,
}: {
  partialBlobs: PartialBlob[];
  totalCostInGwei: bigint;
}) => {
  let done = false;
  let selectedPartialBlobs = partialBlobs;
  while (!done) {
    const selectedPartialBlobsWithCost = calculateCostPerPartialBlob({
      totalCostInGwei,
      partialBlobs: selectedPartialBlobs,
    });

    const partialBlobsWithHighEnoughBid = selectedPartialBlobsWithCost.filter(
      (partialBlob) => partialBlob.bidInGwei >= partialBlob.costInGwei,
    );

    const totalLength = partialBlobsWithHighEnoughBid.reduce(
      (acc, partialBlob) => acc + partialBlob.dataLength,
      0,
    );
    if (totalLength > MAX_BLOB_SIZE_IN_BYTES) {
      // Remove the blob with the lowest difference between bid and cost
      const blobToRemove = partialBlobsWithHighEnoughBid.reduce(
        (acc, partialBlob) => {
          const difference = partialBlob.bidInGwei - partialBlob.costInGwei;

          if (acc.maxDifference === null) {
            return { maxDifference: difference, partialBlob };
          }

          return difference < acc.maxDifference
            ? { maxDifference: difference, partialBlob }
            : acc;
        },
        { maxDifference: null, partialBlob: null } as {
          maxDifference: bigint | null;
          partialBlob: PartialBlob | null;
        },
      ).partialBlob;

      selectedPartialBlobs = partialBlobsWithHighEnoughBid.filter(
        (partialBlob) => partialBlob !== blobToRemove,
      );

      continue;
    }

    const noBlobsRemoved =
      partialBlobsWithHighEnoughBid.length ===
      selectedPartialBlobsWithCost.length;
    const noBlobsLeft = partialBlobsWithHighEnoughBid.length === 0;

    if (noBlobsRemoved || noBlobsLeft) {
      done = true;
    }

    selectedPartialBlobs = partialBlobsWithHighEnoughBid;
  }

  return selectedPartialBlobs.map((partialBlob) => {
    const originalPartialBlob = {
      ...partialBlob,
      costInGwei: null,
      dataLength: undefined,
    };

    delete originalPartialBlob.dataLength;

    return originalPartialBlob;
  });
};
