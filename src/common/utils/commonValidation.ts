import { z } from "zod";

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !isNaN(Number(data)), "ID must be a numeric value")
    .transform(Number)
    .refine((num) => num > 0, "ID must be a positive number"),
  // ... other common validations

  hex: z
    .string()
    .startsWith("0x")
    .toLowerCase()
    .regex(/^0x[0-9a-f]+$/),
};
