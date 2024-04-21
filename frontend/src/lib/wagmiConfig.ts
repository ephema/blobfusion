import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
