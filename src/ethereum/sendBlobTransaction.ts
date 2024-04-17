import { type Hex, parseGwei, toBlobs } from "viem";

import { getKZG } from "./kzg";
import { blobSubmitterWalletClient } from "./viemClients";

export const sendBlobTransaction = async ({ data }: { data: Hex }) => {
  const kzg = await getKZG();

  // TODO: Don't use toBlobs (https://github.com/wevm/viem/blob/main/src/utils/blob/toBlobs.ts)
  // to make raw blobs without viem delimiters
  return blobSubmitterWalletClient.sendTransaction({
    blobs: toBlobs({ data }),
    kzg,
    to: "0x0000000000000000000000000000000000000000",
    maxFeePerBlobGas: parseGwei("500"), // TODO: Use correct estimate for blobs
  });
};
