import { concat, Hex, isHex, pad, toBytes, toHex } from "viem";

import { type PartialBlob } from "@/api/partialBlob/partialBlobModel";
import {
  BLOB_DATA_SIZE_LENGTH_IN_BYTES,
  HEX_MULTIPLIER,
  SIGNATURE_LENGTH_IN_BYTES,
} from "@/common/constants";

// FusedBlobs have the following structure:
// (<signature><length><data>)+

// FuseBlobs takes an array of ordered PartialBlobs and returns a single Buffer
export const fusePartialBlobs = (partialBlobs: PartialBlob[]) => {
  const fusedBlob = concat(
    partialBlobs.map((blob) => {
      const { data, signature } = blob;
      const dataLength = getDataLengthInHex(data);
      return concat([signature, dataLength, data]);
    }),
  );

  return fusedBlob;
};

export const unfuseFusedBlob = (fusedBlob: Hex) => {
  if (!isHex(fusedBlob)) {
    throw new Error("Invalid hex");
  }

  const partialBlobs = [];
  let offset = 0;

  offset += 2; // skip the 0x prefix

  while (offset < fusedBlob.length) {
    const signature = fusedBlob.slice(
      offset,
      offset + SIGNATURE_LENGTH_IN_BYTES * HEX_MULTIPLIER,
    );
    offset += SIGNATURE_LENGTH_IN_BYTES * HEX_MULTIPLIER;

    const dataLengthInHex = fusedBlob.slice(
      offset,
      offset + BLOB_DATA_SIZE_LENGTH_IN_BYTES * HEX_MULTIPLIER,
    );
    const dataLength = parseInt(dataLengthInHex, 16);

    offset += BLOB_DATA_SIZE_LENGTH_IN_BYTES * HEX_MULTIPLIER;

    const data = fusedBlob.slice(offset, offset + dataLength * HEX_MULTIPLIER);
    offset += dataLength * HEX_MULTIPLIER;

    partialBlobs.push({
      signature: `0x${signature}`,
      data: `0x${data}`,
    });
  }

  return partialBlobs;
};

export const getDataLengthInHex = (data: Hex) => {
  const bytes = toBytes(data);
  const dataLength = bytes.length;
  return pad(toHex(dataLength), {
    size: BLOB_DATA_SIZE_LENGTH_IN_BYTES,
  });
};
