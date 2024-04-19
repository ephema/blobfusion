import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { env } from "@/common/utils/envConfig";

import {
  BLOBSCAN_BASE_URLS,
  getBlobSubmissionChainFromId,
  getDepositContractChainFromId,
} from "./supportedChains";

const blobSubmitterRpcUrl = env.BLOB_SUBMITTER_RPC_URL;
export const blobSubmitterWalletClient = createWalletClient({
  account: privateKeyToAccount(env.BLOB_SUBMITTER_PRIVATE_KEY),
  chain: getBlobSubmissionChainFromId(env.BLOB_SUBMITTER_CHAIN_ID),
  transport: http(blobSubmitterRpcUrl ? blobSubmitterRpcUrl : undefined),
});
export const blobSubmitterPublicClient = createPublicClient({
  chain: getBlobSubmissionChainFromId(env.BLOB_SUBMITTER_CHAIN_ID),
  transport: http(blobSubmitterRpcUrl ? blobSubmitterRpcUrl : undefined),
});
export const BLOBSCAN_BASE_URL =
  BLOBSCAN_BASE_URLS[env.BLOB_SUBMITTER_CHAIN_ID];

const depositContractRpcUrl = env.DEPOSIT_CONTRACT_RPC_URL;
export const depositContractWalletClient = createWalletClient({
  account: privateKeyToAccount(env.DEPOSIT_CONTRACT_DEPLOY_PRIVATE_KEY),
  chain: getDepositContractChainFromId(env.DEPOSIT_CONTRACT_CHAIN_ID),
  transport: http(depositContractRpcUrl ? depositContractRpcUrl : undefined),
});

export const depositContractPublicClient = createPublicClient({
  chain: getDepositContractChainFromId(env.DEPOSIT_CONTRACT_CHAIN_ID),
  transport: http(depositContractRpcUrl ? depositContractRpcUrl : undefined),
});
