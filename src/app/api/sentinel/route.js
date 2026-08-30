/**
 * GET /api/sentinel
 * GET /api/sentinel?tokenId=1
 * 
 * Reads sentinel data directly from SentinelRegistry contract on-chain.
 * If tokenId is provided, returns that specific sentinel.
 * If no tokenId is provided, returns all on-chain sentinels.
 */
import { ethers } from "ethers";

const SENTINEL_REGISTRY_ABI = [
  {
    inputs: [],
    name: "totalSentinels",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getSentinel",
    outputs: [{
      components: [
        { name: "id", type: "uint256" },
        { name: "owner", type: "address" },
        { name: "name", type: "string" },
        { name: "metadataURI", type: "string" },
        { name: "reputation", type: "uint256" },
        { name: "totalDetections", type: "uint256" },
        { name: "falsePositives", type: "uint256" },
        { name: "createdAt", type: "uint256" },
        { name: "lastActiveAt", type: "uint256" },
        { name: "status", type: "uint8" },
        { name: "tier", type: "uint8" },
      ],
      name: "",
      type: "tuple",
    }],
    stateMutability: "view",
    type: "function",
  },
];

function formatSentinel(s) {
  let metadata = null;
  if (s.metadataURI && s.metadataURI.startsWith("data:application/json;base64,")) {
    try {
      const jsonStr = Buffer.from(s.metadataURI.replace("data:application/json;base64,", ""), "base64").toString("utf-8");
      metadata = JSON.parse(jsonStr);
    } catch {
      // Ignored
    }
  }

  return {
    id: Number(s.id),
    owner: s.owner,
    name: s.name,
    metadataURI: s.metadataURI,
    description: metadata?.description || "",
    specialization: metadata?.specialization || "general",
    reputation: Number(s.reputation),
    totalDetections: Number(s.totalDetections),
    detections: Number(s.totalDetections),
    falsePositives: Number(s.falsePositives),
    createdAt: Number(s.createdAt),
    lastActiveAt: Number(s.lastActiveAt),
    status: Number(s.status),
    tier: Number(s.tier),
    lastActive: s.lastActiveAt > 0n ? new Date(Number(s.lastActiveAt) * 1000).toLocaleTimeString() : "on-chain",
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get("tokenId");

    const rpc = process.env.ZG_TESTNET_RPC || "https://evmrpc-testnet.0g.ai";
    const registryAddr = process.env.NEXT_PUBLIC_SENTINEL_REGISTRY;

    if (!registryAddr) {
      return Response.json({ error: "Registry address not configured", sentinels: [] }, { status: 500 });
    }

    const provider = new ethers.JsonRpcProvider(rpc);
    const registry = new ethers.Contract(registryAddr, SENTINEL_REGISTRY_ABI, provider);

    if (tokenId) {
      const sentinel = await registry.getSentinel(tokenId);
      return Response.json({
        sentinel: formatSentinel(sentinel),
      });
    }

    // Fetch all on-chain sentinels
    const totalCount = await registry.totalSentinels().catch(() => 0n);
    const total = Number(totalCount);
    const sentinels = [];

    for (let i = 1; i <= total; i++) {
      try {
        const s = await registry.getSentinel(i);
        sentinels.push(formatSentinel(s));
      } catch (err) {
        console.error(`Failed to read sentinel #${i}:`, err.message);
      }
    }

    return Response.json({
      totalSentinels: total,
      sentinels,
    });
  } catch (error) {
    console.error("Sentinel read error:", error);
    return Response.json(
      { error: "Failed to read sentinels", message: error.shortMessage || error.message, sentinels: [] },
      { status: 500 }
    );
  }
}
