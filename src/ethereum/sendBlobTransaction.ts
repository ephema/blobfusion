import { type Hex, toBlobs } from "viem";

import { getBlobGasPriceEstimate } from "@/ethereum/gas/getBlobGasPriceEstimate";

import { getKZG } from "./kzg";
import { blobSubmitterWalletClient } from "./viemClients";

export const sendBlobTransaction = async ({ data }: { data: Hex }) => {
  const kzg = await getKZG();
  const maxFeePerBlobGas = await getBlobGasPriceEstimate();

  return blobSubmitterWalletClient.sendTransaction({
    blobs: toBlobs({ data }),
    kzg,
    to: "0x0000000000000000000000000000000000000000",
    maxFeePerBlobGas,
  });
};
