import dotenv from "dotenv";
import { cleanEnv, host, makeValidator, num, port, str } from "envalid";
import { isHex } from "viem";

import { SUPPORTED_CHAINS } from "@/ethereum/supportedChains";

dotenv.config();

const hexStringValidator = makeValidator((x) => {
  if (isHex(x)) {
    return x;
  }

  throw new Error("Expected the private key to start with 0x");
});

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "test", "production"] }),
  HOST: host(),
  PORT: port(),
  CORS_ORIGIN: str(),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num(),
  COMMON_RATE_LIMIT_WINDOW_MS: num(),
  BLOB_SENDER_CHAIN_ID: num({
    choices: SUPPORTED_CHAINS.map((chain) => chain.id),
  }),
  BLOB_SENDER_RPC_URL: str({ default: "" }),
  BLOB_SENDER_PRIVATE_KEY: hexStringValidator(),
  DEPOSIT_CONTRACT_OWNER_PUBLIC_KEY: hexStringValidator(),
});
