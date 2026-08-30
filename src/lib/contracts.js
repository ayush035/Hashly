// Contract ABIs  - extracted from compiled artifacts
// These are the minimal ABIs needed for frontend interaction

export const SENTINEL_REGISTRY_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [{ name: "name", type: "string" }, { name: "metadataURI", type: "string" }], name: "mintSentinel", outputs: [{ name: "tokenId", type: "uint256" }], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ name: "tokenId", type: "uint256" }], name: "getSentinel", outputs: [{ components: [{ name: "id", type: "uint256" }, { name: "owner", type: "address" }, { name: "name", type: "string" }, { name: "metadataURI", type: "string" }, { name: "reputation", type: "uint256" }, { name: "totalDetections", type: "uint256" }, { name: "falsePositives", type: "uint256" }, { name: "createdAt", type: "uint256" }, { name: "lastActiveAt", type: "uint256" }, { name: "status", type: "uint8" }, { name: "tier", type: "uint8" }], name: "", type: "tuple" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalSentinels", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "owner", type: "address" }], name: "getOwnerSentinels", outputs: [{ name: "", type: "uint256[]" }], stateMutability: "view", type: "function" },
  { anonymous: false, inputs: [{ indexed: true, name: "tokenId", type: "uint256" }, { indexed: true, name: "owner", type: "address" }, { indexed: false, name: "name", type: "string" }, { indexed: false, name: "metadataURI", type: "string" }], name: "SentinelMinted", type: "event" },
];

export const PROTOCOL_GUARD_ABI = [
  { inputs: [{ name: "protocol", type: "address" }], name: "isProtocolPaused", outputs: [{ name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalAlerts", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "alertId", type: "uint256" }], name: "getAlert", outputs: [{ components: [{ name: "id", type: "uint256" }, { name: "protocol", type: "address" }, { name: "sentinelId", type: "uint256" }, { name: "threatLevel", type: "uint256" }, { name: "threatType", type: "string" }, { name: "evidenceHash", type: "string" }, { name: "timestamp", type: "uint256" }, { name: "status", type: "uint8" }], name: "", type: "tuple" }], stateMutability: "view", type: "function" },
  { anonymous: false, inputs: [{ indexed: true, name: "alertId", type: "uint256" }, { indexed: true, name: "protocol", type: "address" }, { indexed: true, name: "sentinelId", type: "uint256" }, { indexed: false, name: "threatLevel", type: "uint256" }, { indexed: false, name: "threatType", type: "string" }], name: "AlertRaised", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, name: "protocol", type: "address" }, { indexed: true, name: "alertId", type: "uint256" }, { indexed: true, name: "sentinelId", type: "uint256" }, { indexed: false, name: "threatLevel", type: "uint256" }], name: "CircuitBreakerTriggered", type: "event" },
];

// Contract addresses  - filled after deployment
export const CONTRACTS = {
  sentinelRegistry: process.env.NEXT_PUBLIC_SENTINEL_REGISTRY || "",
  protocolGuard: process.env.NEXT_PUBLIC_PROTOCOL_GUARD || "",
  vulnerableVault: process.env.NEXT_PUBLIC_VULNERABLE_VAULT || "",
};
