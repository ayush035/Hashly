import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

// 0G Galileo Testnet chain definition
export const zgTestnet = defineChain({
  id: 16602,
  name: "0G Galileo Testnet",
  nativeCurrency: { name: "OG", symbol: "OG", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evmrpc-testnet.0g.ai"] },
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
  ssr: true,
});
