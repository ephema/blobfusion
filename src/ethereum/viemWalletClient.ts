import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { env } from "@/common/utils/envConfig";

import { getChainFromId } from "./supportedChains";

const chainId = env.BLOB_SENDER_CHAIN_ID;
const privateKey = env.BLOB_SENDER_PRIVATE_KEY;
const rpcUrl = env.BLOB_SENDER_RPC_URL;

const account = privateKeyToAccount(privateKey);

export const viemWalletClient = createWalletClient({
  account,
  chain: getChainFromId(chainId),
  transport: http(rpcUrl ? rpcUrl : undefined),
});
