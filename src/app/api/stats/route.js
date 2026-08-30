/**
 * GET /api/stats
 * 
 * Reads real-time on-chain stats from deployed contracts:
 * - SentinelRegistry.totalSentinels()
 * - ProtocolGuard.totalAlerts()
 * - ProtocolGuard.isProtocolPaused(vulnerableVault)
 */
import { ethers } from "ethers";

const SENTINEL_ABI = [
  { inputs: [], name: "totalSentinels", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
];

const GUARD_ABI = [
  { inputs: [], name: "totalAlerts", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "protocol", type: "address" }], name: "isProtocolPaused", outputs: [{ name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "getRegisteredProtocols", outputs: [{ name: "", type: "address[]" }], stateMutability: "view", type: "function" },
];

export async function GET() {
  try {
    const rpc = process.env.ZG_TESTNET_RPC || "https://evmrpc-testnet.0g.ai";
    const registryAddr = process.env.NEXT_PUBLIC_SENTINEL_REGISTRY;
    const guardAddr = process.env.NEXT_PUBLIC_PROTOCOL_GUARD;
    const vaultAddr = process.env.NEXT_PUBLIC_VULNERABLE_VAULT;

    if (!registryAddr || !guardAddr) {
      return Response.json({
        totalSentinels: 0,
        totalAlerts: 0,
        isPaused: false,
        protocolCount: 0,
        source: "default",
      });
    }

    const provider = new ethers.JsonRpcProvider(rpc);

    const registry = new ethers.Contract(registryAddr, SENTINEL_ABI, provider);
    const guard = new ethers.Contract(guardAddr, GUARD_ABI, provider);

    const [totalSentinels, totalAlerts, isPaused, protocols] = await Promise.all([
      registry.totalSentinels().catch(() => 0n),
      guard.totalAlerts().catch(() => 0n),
      vaultAddr ? guard.isProtocolPaused(vaultAddr).catch(() => false) : false,
      guard.getRegisteredProtocols().catch(() => []),
    ]);

    return Response.json({
      totalSentinels: Number(totalSentinels),
      totalAlerts: Number(totalAlerts),
      isPaused,
      protocolCount: protocols.length,
      source: "on-chain",
    });
  } catch (error) {
    console.error("Stats error:", error);
    return Response.json({
      totalSentinels: 0,
      totalAlerts: 0,
      isPaused: false,
      protocolCount: 0,
      source: "error",
      error: error.message,
    });
  }
}
