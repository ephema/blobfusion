export const MAX_BLOB_SIZE_IN_BYTES = 1024 * 128;
export const SIGNATURE_LENGTH_IN_BYTES = 65; // Verify: This should be the length of a signature without the 0x prefix
export const BLOB_DATA_SIZE_LENGTH_IN_BYTES = 3;
export const HEX_MULTIPLIER = 2; // 1 byte = 2 hex chars

export const GAS_PER_TX = 21000n;
export const GAS_PER_BLOB = BigInt(2 ** 17); // https://eips.ethereum.org/EIPS/eip-4844#parameters
export const MIN_BASE_FEE_PER_BLOB_GAS = 1n;
export const BLOB_BASE_FEE_UPDATE_FRACTION = 3338477n;
