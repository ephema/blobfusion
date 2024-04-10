import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type PartialBlobSubmission = z.infer<typeof PartialBlobSubmissionSchema>;
export const PartialBlobSubmissionSchema = z.object({
  bid: z.number(),
  signature: z.string(),
  data: z.string(),
  fromAddress: z.string(),
});

export type PartialBlob = z.infer<typeof PartialBlobSchema>;
export const PartialBlobSchema = PartialBlobSubmissionSchema.extend({
  id: z.number(),
  createdAt: z.date().default(() => new Date()),
  includedIn: z.string().nullable(),
  positionInFusedBlob: z.number().nullable(),
  cost: z.number().nullable(),
});

export const PostPartialBlobSchema = z.object({
  body: PartialBlobSubmissionSchema,
});
