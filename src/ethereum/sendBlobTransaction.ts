import { type Hex, toBlobs } from "viem";

import { getBlobGasEstimate } from "@/ethereum/estimateBlobGas";

import { getKZG } from "./kzg";
import { blobSubmitterWalletClient } from "./viemClients";

export const sendBlobTransaction = async ({ data }: { data: Hex }) => {
  const kzg = await getKZG();
  const maxFeePerBlobGas = await getBlobGasEstimate();

  // TODO: Don't use viem's toBlobs to make raw blobs without viem delimiters
  // https://github.com/wevm/viem/blob/main/src/utils/blob/toBlobs.ts
  return blobSubmitterWalletClient.sendTransaction({
    blobs: toBlobs({ data }),
    kzg,
    to: "0x0000000000000000000000000000000000000000",
    maxFeePerBlobGas,
  });
};
