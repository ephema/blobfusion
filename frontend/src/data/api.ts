import axios from "axios";
import { Hex } from "viem";
import { z } from "zod";

import {
  PartialBlobSubmission,
  PartialBlobSubmissionSchema,
} from "./partialBlobSubmissionSchema";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const api = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  responseType: "json",
});

const userSchema = z.object({
  address: z.string(),
  balanceInGwei: z.coerce.bigint(),
});

export const getUser = ({ address }: { address: Hex }) => {
  return api
    .get(`/users/${address}`)
    .then((res) => userSchema.parse(res.data.data));
};

const partialBlobSchema = z.object({
  id: z.number(),
  size: z.number(),
  bidInGwei: z.coerce.bigint(),
  costInGwei: z.coerce.bigint().nullable(),
  fromAddress: z.string(),
  fusedBlobId: z.number().nullable(),
});

const fusedBlobSchema = z.object({
  id: z.number(),
  txHash: z.string().nullable(),
  totalCostInGwei: z.coerce.bigint().nullable(),
  partialBlobs: z.array(partialBlobSchema),
});

const latestBlobSchema = z.object({
  partialBlobs: z.array(partialBlobSchema),
  fusedBlobs: z.array(fusedBlobSchema),
});

export const getLatestBlobs = async () => {
  return api.get("/blobs").then((res) => {
    return latestBlobSchema.parse(res.data.data);
  });
};

export const submitBlob = (data: PartialBlobSubmission) => {
  const partialBlob = PartialBlobSubmissionSchema.parse(data);

  BigInt.prototype.toJSON = function () {
    return this.toString();
  };

  return api.post("/blobs", partialBlob);
};
