import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type PartialBlobSubmission = z.infer<typeof PartialBlobSubmissionSchema>;
export const PartialBlobSubmissionSchema = z.object({
  bid: z.number(),
  signature: z.string(),
  data: z.string().transform((val) => Buffer.from(val)),
  fromAddress: z.string(),
});

export type PartialBlob = z.infer<typeof PartialBlobSchema>;
export const PartialBlobSchema = PartialBlobSubmissionSchema.extend({
  id: z.number(),
  createdAt: z.date().default(() => new Date()),
  fusedBlobId: z.number().nullable(),
  fusedBlobPosition: z.number().nullable(),
  cost: z.number().nullable(),
});

export const PostPartialBlobSchema = z.object({
  body: PartialBlobSubmissionSchema,
});

export const GetPartialBlobSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
