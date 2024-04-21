import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type PartialBlobSubmission = z.infer<typeof PartialBlobSubmissionSchema>;
export const PartialBlobSubmissionSchema = z.object({
  bidInGwei: z.coerce.bigint(),
  signature: commonValidations.signature,
  data: commonValidations.hex,
  fromAddress: commonValidations.address,
});

export type PartialBlob = z.infer<typeof PartialBlobSchema>;
export const PartialBlobSchema = PartialBlobSubmissionSchema.extend({
  id: z.number(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
  fusedBlobId: z.number().nullable(),
  fusedBlobPosition: z.number().nullable(),
  costInGwei: z.coerce.bigint().nullable(),
});

export type PartialBlobInDB = z.infer<typeof PartialBlobDatabaseSchema>;
export const PartialBlobDatabaseSchema = PartialBlobSchema.extend({
  data: z.instanceof(Buffer),
  signature: z.string(),
  fromAddress: z.string(),
});

export const PostPartialBlobSchema = z.object({
  body: PartialBlobSubmissionSchema,
});

export const GetPartialBlobSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
