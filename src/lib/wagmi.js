import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain, http } from "viem";

// 0G Galileo Testnet chain definition
export const zgTestnet = defineChain({
  id: 16602,
  name: "0G Galileo Testnet",
  nativeCurrency: { name: "OG", symbol: "OG", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.ankr.com/0g_galileo_testnet_evm"] },
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
    // Ankr RPC for better compatibility with viem/wagmi JSON-RPC format
    [zgTestnet.id]: http("https://rpc.ankr.com/0g_galileo_testnet_evm", {
      batch: false,
      retryCount: 3,
      retryDelay: 150,
    }),
  },
  ssr: true,
});
