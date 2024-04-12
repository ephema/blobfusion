import { PartialBlob } from "./partialBlobModel";

export const convertDataFieldBufferToHex = (
  partialBlob: Omit<PartialBlob, "data"> & { data: Buffer },
): PartialBlob => {
  return {
    ...partialBlob,
    data: `0x${Buffer.from(partialBlob.data).toString("hex")}`,
  };
};

export const convertHexToBuffer = (data: string | Buffer) => {
  return typeof data === "string"
    ? Buffer.from(data.replace("0x", ""), "hex")
    : data;
};
