import { gnosis, holesky, mainnet, sepolia } from "viem/chains";

type SupportedChain = (typeof SUPPORTED_CHAINS)[number];
type SupportedChainId = SupportedChain["id"];
export const SUPPORTED_CHAINS = [sepolia, mainnet, holesky, gnosis] as const;

export const getChainFromId = (chainId: SupportedChainId) =>
  SUPPORTED_CHAINS.find((chain) => chain.id === chainId);
