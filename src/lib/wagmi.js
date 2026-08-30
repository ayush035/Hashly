import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain, http, fallback } from "viem";

// 0G Galileo Testnet chain definition
export const zgTestnet = defineChain({
  id: 16602,
  name: "0G Galileo Testnet",
  nativeCurrency: { name: "OG", symbol: "OG", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        "https://evmrpc-testnet.0g.ai",
        "https://rpc.ankr.com/0g_galileo_testnet_evm",
        "https://0g-galileo-testnet.drpc.org",
      ],
    },
    public: {
      http: [
        "https://evmrpc-testnet.0g.ai",
        "https://rpc.ankr.com/0g_galileo_testnet_evm",
        "https://0g-galileo-testnet.drpc.org",
      ],
    },
  },
  blockExplorers: {
    default: { name: "0G ChainScan", url: "https://chainscan-galileo.0g.ai" },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: "Hashly",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "9174d135ff3ead793285d03479e4d37c",
  chains: [zgTestnet],
  transports: {
    [zgTestnet.id]: fallback([
      http("https://evmrpc-testnet.0g.ai", { batch: false }),
      http("https://rpc.ankr.com/0g_galileo_testnet_evm", { batch: false }),
      http("https://0g-galileo-testnet.drpc.org", { batch: false }),
    ]),
  },
  ssr: true,
});
