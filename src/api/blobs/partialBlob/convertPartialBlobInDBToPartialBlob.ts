import { type Hex } from "viem";

import { PartialBlob, PartialBlobInDB } from "./partialBlobModel";

export const convertPartialBlobInDBToPartialBlob = (
  partialBlob: PartialBlobInDB,
): PartialBlob => {
  return {
    ...partialBlob,
    data: convertBufferToHex(partialBlob.data),
    signature: partialBlob.signature as Hex,
    fromAddress: partialBlob.fromAddress as Hex,
  };
};

export const convertPartialBlobToPartialBlobInDB = (
  partialBlob: PartialBlob,
): PartialBlobInDB => {
  return {
    ...partialBlob,
    data: convertHexToBuffer(partialBlob.data),
  };
};

export const convertHexToBuffer = (data: Hex) => {
  return Buffer.from(data.replace("0x", ""), "hex");
};

export const convertBufferToHex = (data: Buffer): Hex => {
  return `0x${Buffer.from(data).toString("hex")}`;
};
