import { isAddress, isHex } from "viem";
import { z } from "zod";

import { HEX_MULTIPLIER, SIGNATURE_LENGTH_IN_BYTES } from "../constants";

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !isNaN(Number(data)), "ID must be a numeric value")
    .transform(Number)
    .refine((num) => num > 0, "ID must be a positive number"),
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
