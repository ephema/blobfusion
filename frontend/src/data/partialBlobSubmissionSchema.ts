// TODO: Share code with the server

import { isAddress, isHex } from "viem";
import { z } from "zod";

const SIGNATURE_LENGTH_IN_BYTES = 65;
const HEX_MULTIPLIER = 2; // 1 byte = 2 hex chars

const commonValidations = {
  hex: z.string().refine(isHex, "Invalid hex"),
  signature: z
    .string()
    .length(
      SIGNATURE_LENGTH_IN_BYTES * HEX_MULTIPLIER + 2, // +2 for 0x prefix
      "Invalid signature length",
    )
    .refine(isHex, "Invalid hex"),
  address: z.string().refine(isAddress, "Invalid address"),
};

export type PartialBlobSubmission = z.infer<typeof PartialBlobSubmissionSchema>;
export const PartialBlobSubmissionSchema = z.object({
  bidInGwei: z.coerce.bigint(),
  signature: commonValidations.signature,
  data: commonValidations.hex,
  fromAddress: commonValidations.address,
});
