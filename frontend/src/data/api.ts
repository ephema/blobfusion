import axios from "axios";
import { Hex } from "viem";
import { z } from "zod";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const api = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  responseType: "json",
});

const userSchema = z.object({
  publicAddress: z.string(),
  balance: z.number(),
});

export const getUser = ({ publicAddress }: { publicAddress: Hex }) => {
  return api
    .get(`/user/${publicAddress}`)
    .then((res) => userSchema.parse(res.data));
};

const partialBlobSchema = z.object({
  id: z.number(),
  size: z.number(),
  bidInGwei: z.number(),
  costInGwei: z.number().nullable(),
  fromAddress: z.string(),
  fusedBlobId: z.number().nullable(),
});

const fusedBlobSchema = z.object({
  id: z.number(),
  txHash: z.string(),
  totalCostInGwei: z.number().nullable(),
  fusedBlobs: z.array(partialBlobSchema),
});

const latestBlobSchema = z.object({
  unfusedBlobs: z.array(partialBlobSchema),
  fusedBlobs: z.array(fusedBlobSchema),
});

export const getLatestBlobs = async () => {
  return api.get("/blobs").then((res) => latestBlobSchema.parse(res.data));
};
