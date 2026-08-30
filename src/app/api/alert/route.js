/**
 * POST /api/alert
 * 
 * Raises an on-chain alert via ProtocolGuard.raiseAlert().
 * This is server-side because raiseAlert() is onlyAdmin,
 * so it requires the deployer's private key to sign.
 */
import { ethers } from "ethers";

const PROTOCOL_GUARD_ABI = [
  {
    inputs: [
      { name: "protocol", type: "address" },
      { name: "sentinelId", type: "uint256" },
      { name: "threatLevel", type: "uint256" },
      { name: "threatType", type: "string" },
      { name: "evidenceHash", type: "string" },
    ],
    name: "raiseAlert",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "protocol", type: "address" }, { name: "name", type: "string" }, { name: "minThreatLevel", type: "uint256" }],
    name: "registerProtocol",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "protocol", type: "address" }],
    name: "isProtocolPaused",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAlerts",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "protocol", type: "address" }],
    name: "getProtocol",
    outputs: [{
      components: [
        { name: "protocol", type: "address" },
        { name: "name", type: "string" },
        { name: "isRegistered", type: "bool" },
        { name: "isPaused", type: "bool" },
        { name: "totalAlerts", type: "uint256" },
        { name: "totalPauses", type: "uint256" },
        { name: "registeredAt", type: "uint256" },
        { name: "lastAlertAt", type: "uint256" },
        { name: "assignedSentinels", type: "uint256[]" },
        { name: "minThreatLevelForPause", type: "uint256" },
      ],
      name: "",
      type: "tuple",
    }],
    stateMutability: "view",
    type: "function",
  },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { protocol, sentinelId, threatLevel, threatType, evidenceHash } = body;

    const privateKey = process.env.PRIVATE_KEY;
    const rpc = process.env.ZG_TESTNET_RPC || "https://evmrpc-testnet.0g.ai";
    const protocolGuardAddr = process.env.NEXT_PUBLIC_PROTOCOL_GUARD;

    if (!privateKey || !protocolGuardAddr) {
      return Response.json({
        success: false,
        error: "Server not configured for on-chain alerts (missing PRIVATE_KEY or PROTOCOL_GUARD address)",
        mock: true,
      });
    }

    const provider = new ethers.JsonRpcProvider(rpc);
    const signer = new ethers.Wallet(privateKey, provider);
    const guard = new ethers.Contract(protocolGuardAddr, PROTOCOL_GUARD_ABI, signer);

    // Check if protocol is registered, if not register it first
    const targetProtocol = protocol || process.env.NEXT_PUBLIC_VULNERABLE_VAULT;

    try {
      const protocolConfig = await guard.getProtocol(targetProtocol);
      if (!protocolConfig.isRegistered) {
        console.log("Registering protocol:", targetProtocol);
        const regTx = await guard.registerProtocol(targetProtocol, "VulnerableVault", 7);
        await regTx.wait();
        console.log("Protocol registered:", regTx.hash);
      }
    } catch (regErr) {
      // Protocol might already be registered, continue
      console.log("Protocol registration check:", regErr.message);
    }

    // Raise the alert on-chain
    const tx = await guard.raiseAlert(
      targetProtocol,
      sentinelId || 1,
      threatLevel || 8,
      threatType || "UNKNOWN",
      evidenceHash || "0x0000"
    );

    const receipt = await tx.wait();

    // Check if circuit breaker was triggered by looking at events
    let circuitBreakerTriggered = false;
    for (const log of receipt.logs) {
      try {
        const parsed = guard.interface.parseLog(log);
        if (parsed && parsed.name === "CircuitBreakerTriggered") {
          circuitBreakerTriggered = true;
        }
      } catch {
        // Not a ProtocolGuard event, skip
      }
    }

    // Check paused status after
    const isPaused = await guard.isProtocolPaused(targetProtocol);
    const totalAlerts = await guard.totalAlerts();

    return Response.json({
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      circuitBreakerTriggered,
      isPaused,
      totalAlerts: Number(totalAlerts),
      explorerUrl: `https://chainscan-galileo.0g.ai/tx/${receipt.hash}`,
    });
  } catch (error) {
    console.error("Alert error:", error);
    return Response.json(
      { success: false, error: error.message, shortMessage: error.shortMessage || error.message },
      { status: 500 }
    );
  }
}
