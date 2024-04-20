import { Hex, toBytes } from "viem";

import {
  BLOB_DATA_SIZE_LENGTH_IN_BYTES,
  SIGNATURE_LENGTH_IN_BYTES,
} from "@/common/constants";

export const getBlobDataLength = (blobData: Hex) =>
  SIGNATURE_LENGTH_IN_BYTES +
  BLOB_DATA_SIZE_LENGTH_IN_BYTES +
  toBytes(blobData).length;
