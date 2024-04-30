import { extractChain } from "viem";
import { createConfig, http } from "wagmi";
import { arbitrumSepolia, hardhat } from "wagmi/chains";

const supportedChains = [hardhat, arbitrumSepolia];

const supportedChainIds = supportedChains.map((chain) => chain.id);

const chainId = Number(process.env.NEXT_PUBLIC_DEPOSIT_CONTRACT_CHAIN_ID);
if (!chainId || !supportedChainIds.includes(chainId)) {
  throw new Error(
    "NEXT_PUBLIC_DEPOSIT_CONTRACT_CHAIN_ID needs to be set in .env",
  );
}

const chain = extractChain({
  chains: [hardhat, arbitrumSepolia],
  id: chainId,
});

export const wagmiConfig = createConfig({
  chains: [chain],
  transports: {
    [hardhat.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
