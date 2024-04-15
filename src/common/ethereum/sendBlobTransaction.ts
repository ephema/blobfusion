import { type Hex, parseGwei, toBlobs } from "viem";

import { getKZG } from "./kzg";
import { viemWalletClient } from "./viemWalletClient";

export const sendBlobTransaction = async ({ data }: { data: Hex }) => {
  const kzg = await getKZG();

  return viemWalletClient.sendTransaction({
    blobs: toBlobs({ data }),
    kzg,
    to: "0x0000000000000000000000000000000000000000",
    maxFeePerBlobGas: parseGwei("500"), // TODO: Use correct estimate for blobs
  });
};
