import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

// TODO: verify that signature is valid signature of data
// and that fromAddress is the address that signed the data
export type PartialBlobSubmission = z.infer<typeof PartialBlobSubmissionSchema>;
export const PartialBlobSubmissionSchema = z.object({
  bid: z.number(),
  signature: commonValidations.signature,
  // TODO: data has to be smaller than MAX_BLOB_SIZE_IN_BYTES + SIGNATURE_LENGTH_IN_BYTES + BLOB_DATA_SIZE_LENGTH_IN_BYTES
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
  cost: z.number().nullable(),
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
