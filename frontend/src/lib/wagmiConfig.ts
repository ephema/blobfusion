import { extractChain } from "viem";
import { http, createConfig } from "wagmi";
import { arbitrum, hardhat } from "wagmi/chains";

const supportedChains = [hardhat, arbitrum];

const supportedChainIds = supportedChains.map((chain) => chain.id);

const chainId = Number(process.env.NEXT_PUBLIC_DEPOSIT_CONTRACT_CHAIN_ID);
if (!chainId || !supportedChainIds.includes(chainId)) {
  throw new Error(
    "NEXT_PUBLIC_DEPOSIT_CONTRACT_CHAIN_ID needs to be set in .env",
  );
}

const chain = extractChain({
  chains: [hardhat, arbitrum],
  id: chainId,
});

export const wagmiConfig = createConfig({
  chains: [chain],
  transports: {
    [hardhat.id]: http(),
    [arbitrum.id]: http(),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
