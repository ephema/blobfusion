import "@nomicfoundation/hardhat-toolbox-viem";

import { type HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  paths: {
    root: "./src/ethereum",
  },
};

export default config;
