import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import dotenv from "dotenv";
import { isHex } from "viem";

dotenv.config();

const BlobFusionModule = buildModule("BlobFusionModule", (m) => {
  const initialOwner = process.env.DEPOSIT_CONTRACT_OWNER_PUBLIC_KEY;

  if (!isHex(initialOwner)) {
    throw new Error("Please provide a valid public key for the initial owner");
  }
  const blobFusion = m.contract("BlobFusion", [initialOwner]);

  return { blobFusion };
});

export default BlobFusionModule;
