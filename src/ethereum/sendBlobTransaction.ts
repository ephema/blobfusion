import { type Hex } from "viem";

import { getBlobGasEstimate } from "@/ethereum/gas/estimateBlobGas";

import { getKZG } from "./kzg";
import { blobSubmitterWalletClient } from "./viemClients";

export const sendBlobTransaction = async ({ data }: { data: Hex }) => {
  const kzg = await getKZG();
  const maxFeePerBlobGas = await getBlobGasEstimate();

  return blobSubmitterWalletClient.sendTransaction({
    blobs: [data],
    kzg,
    to: "0x0000000000000000000000000000000000000000",
    maxFeePerBlobGas,
  });
};
