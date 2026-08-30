// Contract ABIs - extracted from compiled Solidity artifacts
// Full ABIs for frontend interaction with wagmi

export const SENTINEL_REGISTRY_ABI = [
  // Write functions
  {
    inputs: [{ name: "name", type: "string" }, { name: "metadataURI", type: "string" }],
    name: "mintSentinel",
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }, { name: "to", type: "address" }],
    name: "transferSentinel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }, { name: "protocol", type: "address" }, { name: "threatLevel", type: "uint256" }],
    name: "recordDetection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }, { name: "newMetadataURI", type: "string" }],
    name: "updateMetadata",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }, { name: "operator", type: "address" }, { name: "authorized", type: "bool" }],
    name: "setOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Read functions
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
  {
    inputs: [],
    name: "totalSentinels",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "getOwnerSentinels",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getSentinelTier",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: true, name: "owner", type: "address" },
      { indexed: false, name: "name", type: "string" },
      { indexed: false, name: "metadataURI", type: "string" },
    ],
    name: "SentinelMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: false, name: "oldReputation", type: "uint256" },
      { indexed: false, name: "newReputation", type: "uint256" },
      { indexed: false, name: "newTier", type: "uint8" },
    ],
    name: "ReputationUpdated",
    type: "event",
  },
];

export const PROTOCOL_GUARD_ABI = [
  // Write functions (admin only - called server-side)
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
    inputs: [{ name: "protocol", type: "address" }, { name: "sentinelId", type: "uint256" }],
    name: "assignSentinel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "alertId", type: "uint256" }, { name: "isFalsePositive", type: "bool" }],
    name: "resolveAlert",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "protocol", type: "address" }],
    name: "resumeProtocol",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Read functions
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
    inputs: [{ name: "alertId", type: "uint256" }],
    name: "getAlert",
    outputs: [{
      components: [
        { name: "id", type: "uint256" },
        { name: "protocol", type: "address" },
        { name: "sentinelId", type: "uint256" },
        { name: "threatLevel", type: "uint256" },
        { name: "threatType", type: "string" },
        { name: "evidenceHash", type: "string" },
        { name: "timestamp", type: "uint256" },
        { name: "status", type: "uint8" },
      ],
      name: "",
      type: "tuple",
    }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllAlertIds",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRegisteredProtocols",
    outputs: [{ name: "", type: "address[]" }],
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
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "alertId", type: "uint256" },
      { indexed: true, name: "protocol", type: "address" },
      { indexed: true, name: "sentinelId", type: "uint256" },
      { indexed: false, name: "threatLevel", type: "uint256" },
      { indexed: false, name: "threatType", type: "string" },
    ],
    name: "AlertRaised",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "protocol", type: "address" },
      { indexed: true, name: "alertId", type: "uint256" },
      { indexed: true, name: "sentinelId", type: "uint256" },
      { indexed: false, name: "threatLevel", type: "uint256" },
    ],
    name: "CircuitBreakerTriggered",
    type: "event",
  },
];

// Contract addresses from deployment
export const CONTRACTS = {
  sentinelRegistry: process.env.NEXT_PUBLIC_SENTINEL_REGISTRY || "",
  protocolGuard: process.env.NEXT_PUBLIC_PROTOCOL_GUARD || "",
  vulnerableVault: process.env.NEXT_PUBLIC_VULNERABLE_VAULT || "",
};

// Tier labels
export const TIER_LABELS = ["scout", "guardian", "warden", "overlord"];
export const STATUS_LABELS = ["active", "paused", "decommissioned"];
