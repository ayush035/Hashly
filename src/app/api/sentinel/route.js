/**
 * GET /api/sentinel?tokenId=1
 * 
 * Reads a sentinel's data from the SentinelRegistry contract on-chain.
 * Server-side to avoid browser RPC issues.
 */
import { ethers } from "ethers";

const SENTINEL_REGISTRY_ABI = [
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get("tokenId");

    if (!tokenId) {
      return Response.json({ error: "tokenId required" }, { status: 400 });
    }

    const rpc = process.env.ZG_TESTNET_RPC || "https://evmrpc-testnet.0g.ai";
    const registryAddr = process.env.NEXT_PUBLIC_SENTINEL_REGISTRY;

    if (!registryAddr) {
      return Response.json({ error: "Registry address not configured" }, { status: 500 });
    }

    const provider = new ethers.JsonRpcProvider(rpc);
    const registry = new ethers.Contract(registryAddr, SENTINEL_REGISTRY_ABI, provider);

    const sentinel = await registry.getSentinel(tokenId);

    return Response.json({
      sentinel: {
        id: Number(sentinel.id),
        owner: sentinel.owner,
        name: sentinel.name,
        metadataURI: sentinel.metadataURI,
        reputation: Number(sentinel.reputation),
        totalDetections: Number(sentinel.totalDetections),
        falsePositives: Number(sentinel.falsePositives),
        createdAt: Number(sentinel.createdAt),
        lastActiveAt: Number(sentinel.lastActiveAt),
        status: Number(sentinel.status),
        tier: Number(sentinel.tier),
      },
    });
  } catch (error) {
    console.error("Sentinel read error:", error);
    return Response.json(
      { error: "Failed to read sentinel", message: error.shortMessage || error.message },
      { status: 500 }
    );
  }
}
