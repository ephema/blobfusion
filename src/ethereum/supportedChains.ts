import {
  arbitrum,
  arbitrumSepolia,
  gnosis,
  hardhat,
  holesky,
  mainnet,
  sepolia,
} from "viem/chains";

type SupportedBlobSubmissionChain =
  (typeof SUPPORTED_BLOB_SUBMISSION_CHAINS)[number];
type SupportedBlobSubmissionChainId = SupportedBlobSubmissionChain["id"];
export const SUPPORTED_BLOB_SUBMISSION_CHAINS = [
  sepolia,
  mainnet,
  holesky,
  gnosis,
] as const;

export const BLOBSCAN_BASE_URLS = {
  [sepolia.id]: "https://api.sepolia.blobscan.com",
  [mainnet.id]: "https://api.blobscan.com",
  [holesky.id]: "https://api.holesky.blobscan.com",
  [gnosis.id]: "https://api.gnosis.blobscan.com",
} as const;

export const getBlobSubmissionChainFromId = (
  chainId: SupportedBlobSubmissionChainId,
) => SUPPORTED_BLOB_SUBMISSION_CHAINS.find((chain) => chain.id === chainId);

type SupportedDepositContractChain =
  (typeof SUPPORTED_DEPOSIT_CONTRACT_CHAINS)[number];
type SupportedDepositContractChainId = SupportedDepositContractChain["id"];
export const SUPPORTED_DEPOSIT_CONTRACT_CHAINS = [
  arbitrumSepolia,
  arbitrum,
  sepolia,
  hardhat,
] as const;

export const getDepositContractChainFromId = (
  chainId: SupportedDepositContractChainId,
) => SUPPORTED_DEPOSIT_CONTRACT_CHAINS.find((chain) => chain.id === chainId);
