import axios from "axios";
import { createStaleWhileRevalidateCache } from "stale-while-revalidate-cache";

import {
  BLOB_BASE_FEE_UPDATE_FRACTION,
  MIN_BASE_FEE_PER_BLOB_GAS,
} from "@/common/constants";
import { BLOBSCAN_BASE_URL } from "@/ethereum/viemClients";

// There are APIs in the spec to estimate the gas cost of a blob operation:
// https://github.com/ethereum/execution-apis/pull/486 and https://hackmd.io/@flcl/Bkn4nq17T
// but they are not yet merged:
// https://github.com/ethereum/go-ethereum/pull/29140
// So working around this by using a simple estimate based on the Blobscan API.
// Blobscan is sometimes really slow, so using a stale-while-revalidate cache
// to keep impact low

export const getBlobGasEstimate = async () => {
  const resultFromSwrCache = await swr("blobscan-result", async () => {
    const response = await axios.get(
      `${BLOBSCAN_BASE_URL}/blocks?sort=desc&type=canonical&p=1&ps=1`,
    );

    const [lastBlock] = response.data.blocks;
    const { excessBlobGas } = lastBlock;
    const blobBaseFeePerBlobGas = getBaseFeePerBlobGas(BigInt(excessBlobGas));
    const estimate = (blobBaseFeePerBlobGas * 110n) / 100n; // Just to be on the safe side
    return estimate;
  });

  return resultFromSwrCache.value;
};

const storage = new Map<string, bigint>();
const swr = createStaleWhileRevalidateCache({
  retry: 2,
  minTimeToStale: 5000,
  storage: {
    getItem(key) {
      return storage.get(key);
    },
    setItem(key, value) {
      storage.set(key, value as bigint);
    },
    removeItem(key) {
      return storage.delete(key);
    },
  },
});

const getBaseFeePerBlobGas = (excessBlobGas: bigint) => {
  return fakeExponential(
    MIN_BASE_FEE_PER_BLOB_GAS,
    excessBlobGas,
    BLOB_BASE_FEE_UPDATE_FRACTION,
  );
};

const fakeExponential = (
  factor: bigint,
  numerator: bigint,
  denominator: bigint,
) => {
  let i = 1n;
  let output = 0n;
  let numeratorAccum = factor * denominator;
  while (numeratorAccum > 0n) {
    output += numeratorAccum;
    numeratorAccum = (numeratorAccum * numerator) / (denominator * i);
    i += 1n;
  }
  return output / denominator;
};

// const calcBlobFee = (excessBlobGas: bigint, numberOfBlobs: bigint) => {
//   return getTotalBlobGas(numberOfBlobs) * getBaseFeePerBlobGas(excessBlobGas);
// };

// const getTotalBlobGas = (numberOfBlobs: bigint) => {
//   return GAS_PER_BLOB * numberOfBlobs;
// };
