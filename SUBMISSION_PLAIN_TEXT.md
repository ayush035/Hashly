# Hashly — Wave 1 Submission Document (Plain Text Format)

---

## 1. Tagline / One-Liner Description

Hashly is an autonomous on-chain security network that intercepts DeFi exploits in real time using 0G Compute for AI threat classification, 0G Storage for immutable evidence anchoring, and ERC-7857 Agentic IDs for automated circuit breakers on 0G Chain.

---

## 2. Project Description & Overview

DeFi exploits cost over $2 Billion annually in stolen liquidity. Reentrancy loops, flash loan price distortions, and oracle drift attacks execute in mere seconds. Existing security solutions rely on off-chain human monitoring and webhook alerts (like Discord or Telegram bots) that take 15 to 45 minutes to triage — far too late to prevent catastrophic loss.

Hashly replaces passive off-chain alerts with an autonomous, verifiable, closed-loop security infrastructure built natively on the 0G Network:

1. Sub-Second AI Exploit Classification (0G Compute): Raw EVM transaction execution traces (gas spikes, recursive call stack depths, state delta anomalies, and price slippage) are evaluated in real time by decentralized AI models running on the 0G Compute Router.
2. Immutable Forensic Storage (0G Storage): Full exploit telemetry, transaction payloads, and model inference outputs are cryptographically hashed and permanently stored into 0G Storage via the 0G Storage TypeScript SDK, creating a tamper-proof audit trail with on-chain verifiable Merkle root hashes.
3. Automated On-Chain Circuit Breakers (0G Chain): When a threat exceeds the safety threshold (threat level 7 or higher out of 10), Hashly executes on-chain transaction calls to ProtocolGuard on the 0G Galileo Testnet, instantly pausing the target vulnerable vault within the same block.
4. Decentralized Agentic Identities (ERC-7857): Security agents are ownable, tokenized on-chain assets with dynamic system prompts and specializations. Each Sentinel earns reputation on 0G Chain based on verified detections, advancing through tiers: Scout -> Guardian -> Warden -> Overlord.

---

## 3. Why Hashly Plays an Important Role in Web3

In DeFi, security is fundamentally broken because it is reactive and human-dependent:
- Static Audits Cannot Prevent Runtime Attacks: Audits only check known code at deployment time; they cannot stop live economic exploits or novel zero-day attacks.
- Alerting is Too Slow: When an exploit happens, a hacker extracts funds in 12 seconds. Human engineers take 15 to 45 minutes to react, communicate, and sign multi-sig transactions.
- Centralization Bottlenecks: Existing automated pause bots rely on centralized Web2 servers holding private keys with zero transparency or verifiable proof.

Hashly solves this by closing the loop between decentralized AI inference, immutable data verification, and on-chain execution. By leveraging 0G's sub-second compute and high-speed blockchain, Hashly reduces response times from 30 minutes to under 2 seconds — stopping attacks before funds are drained.

---

## 4. Deep Technical Breakdown: How the 4 0G Components Are Used

Hashly is built natively across all four layers of the 0G modular AI ecosystem:

### Component 1: 0G Chain (Galileo Testnet - Chain ID: 16602)
- High-throughput, low-latency execution layer for smart contract state management and emergency circuit breakers.
- Hosts our core contracts: SentinelRegistry.sol, ProtocolGuard.sol, and VulnerableVault.sol.
- Provides sub-2-second block finality, allowing Hashly to trip emergency pauses and update security state within the same block.

### Component 2: 0G Compute Router (Decentralized AI Inference)
- Connects to the 0G Compute Router endpoint using models such as qwen2.5-omni and Llama.
- Ingests raw transaction execution parameters: target contract address, function calldata, gas consumption spikes, recursive call depth, and DEX price slippage.
- The decentralized AI model evaluates the parameters in real time and returns structured threat classifications, confidence scores, threat levels (1 to 10), and natural language reasoning.
- Hashly logs the verifiable 0G trace metadata in real time, including the decentralized AI Node Provider address, Request ID, token consumption count, and total execution cost in a0gi.

### Component 3: 0G Storage (Immutable Forensic Evidence Vault)
- Integrated via the official 0G Storage TypeScript SDK (@0gfoundation/0g-storage-ts-sdk) directly into server-side routes.
- When an attack is detected, Hashly packages the complete incident context (calldata, execution trace, AI model reasoning, and timestamps) into a decentralized blob.
- Uploads the blob to 0G Storage nodes and retrieves an on-chain verifiable Merkle Root Hash.
- This root hash is passed directly into the on-chain circuit breaker transaction, creating a permanent, tamper-proof audit trail for post-mortem analysis.

### Component 4: ERC-7857 Standard (Tokenized Agentic IDs)
- Implemented in SentinelRegistry.sol, where each security Sentinel is minted as an ERC-7857 compliant Agentic ID.
- Creators configure the agent's specialization (Reentrancy, Flash Loans, Oracle Guard, Access Control) and custom system prompts, encoded into base64 metadata stored on-chain.
- Sentinels accumulate verified on-chain reputation every time they detect a threat, advancing through evolutionary tiers:
  - Scout (0 to 4 detections)
  - Guardian (5 to 14 detections)
  - Warden (15 to 29 detections)
  - Overlord (30+ detections)
- Transforms security bots into ownable, transferable, and composable on-chain financial assets.

---

## 5. Deployed Smart Contracts on 0G Galileo Testnet (Chain ID: 16602)

### 1. SentinelRegistry.sol (ERC-7857 Agentic ID Registry)
- Address: 0x01F9d2D5A4eA2BA7139D599b4f6B6D06cCB34bcE
- Explorer Link: https://chainscan-galileo.0g.ai/address/0x01F9d2D5A4eA2BA7139D599b4f6B6D06cCB34bcE
- Key Functions:
  - mintSentinel(name, metadataURI): Mints a new Sentinel agent NFT on 0G Galileo, initializes its reputation to Scout tier, and stores its encoded system prompt and specialization on-chain.
  - recordDetection(tokenId): Called exclusively by ProtocolGuard when an alert is verified; increments the agent's detection count and advances its reputation tier.
  - getSentinel(tokenId): Returns complete on-chain agent metadata including name, reputation score, tier, metadata URI, timestamp, and total detections.
  - totalSentinels(): Returns total count of active on-chain sentinels for dynamic dApp hydration.

### 2. ProtocolGuard.sol (Autonomous Circuit Breaker & Threat Hub)
- Address: 0x6224d82ab9bE92d4eCF116D8cafC13d078B83aFC
- Explorer Link: https://chainscan-galileo.0g.ai/address/0x6224d82ab9bE92d4eCF116D8cafC13d078B83aFC
- Key Functions:
  - raiseAlert(targetProtocol, threatLevel, threatType, evidenceHash, sentinelId): Dispatches an emergency threat alert. If threatLevel is 7 or higher, automatically calls pause() on the target protocol, records the 0G Storage evidence hash, and increments the sentinel's reputation.
  - registerProtocol(protocolAddress, protocolName): Allows third-party DeFi protocols to register their contracts for active Sentinel protection.
  - getAlert(alertId): Fetches on-chain alert parameters, including timestamp, target contract, threat severity, and 0G Storage proof hash.

### 3. VulnerableVault.sol (Interactive Target Protocol)
- Address: 0x67717afbCa0c2A4E060B2Ef0621bF33ef07908C5
- Explorer Link: https://chainscan-galileo.0g.ai/address/0x67717afbCa0c2A4E060B2Ef0621bF33ef07908C5
- Key Functions:
  - deposit(): Accepts deposits and credits user balances.
  - withdraw(amount): Vulnerable withdrawal function lacking reentrancy guards, providing a live testbed for Sentinel reentrancy detection.
  - pause(): Emergency pause function callable by ProtocolGuard to lock deposits and withdrawals when a circuit breaker trips.
  - unpause(): Resumes operations after an incident is resolved.

---

## 6. Everything Built in This Hackathon (Wave 1 Complete Inventory)

1. Smart Contract Suite:
   - Built and deployed SentinelRegistry.sol (ERC-7857), ProtocolGuard.sol, and VulnerableVault.sol to 0G Galileo Testnet.
   - Built Hardhat deployment scripts and automated testing configurations.

2. 0G Compute AI Pipeline:
   - Server-side analysis route (/api/analyze) connecting directly to 0G Compute Router (qwen2.5-omni).
   - Zero-shot exploit classification for Reentrancy, Flash Loans, Oracle Manipulation, and Access Control.
   - Verifiable trace telemetry extracting 0G Node Provider address, Request ID, Token usage breakdown, and billing cost.

3. 0G Storage Evidence Vault:
   - Server-side storage route (/api/storage) integrating @0gfoundation/0g-storage-ts-sdk.
   - Serializes incident data, uploads to 0G Storage nodes, and returns on-chain verifiable Merkle root hashes.

4. ERC-7857 Agent Management UI:
   - Interface to configure and mint on-chain Sentinel agents with custom specializations and system prompts.
   - Base64 calldata URI encoding for on-chain metadata storage.
   - Dynamic tier progression tracking on 0G Galileo with zero hardcoded placeholder data.

5. Exploit Simulation Testbed:
   - Interactive simulator (/dashboard simulate tab) running real-time attacks against VulnerableVault.
   - Real-time terminal output displaying the 4-step security pipeline: Interception -> 0G Compute -> 0G Storage -> On-Chain Circuit Breaker.

6. Production Frontend dApp:
   - Next.js 15 App Router interface with custom dark cybersecurity theme.
   - Wagmi v2 and Viem v2 with multi-RPC fallback across official 0G RPC, Ankr, and dRPC.
   - RainbowKit wallet integration with network auto-detection and 1-click switch to 0G Galileo.
   - Brand assets and custom Cyber Eye Shield logo integrated across all navigation, sidebar, and metadata.

---

## 7. Roadmap: What's Next for Wave 2 & Wave 3

### Wave 2: Swarm Consensus & Headless Sentinel Daemons
- Multi-Agent Swarm Consensus: Implement threshold voting where at least 3 independent Sentinel agents must cross-verify an exploit before triggering a global protocol pause.
- Headless Sentinel Node Daemon (CLI & Docker): Release an open-source background runner (Rust/Node.js) that node operators and protocol developers can run 24/7 to monitor mempool transactions via WebSocket RPC.
- zk-Inference Verification: Integrate zero-knowledge proofs (zkML) on 0G to prove that the AI model execution on 0G Compute was unmodified before on-chain execution.
- @hashly/guard SDK: A 1-line Solidity modifier (modifier hashlyProtected) for third-party DeFi protocols on 0G to instantly inherit autonomous circuit breaker protection.

### Wave 3: Cross-Chain Settlement & Agent Marketplace
- Cross-Chain Emergency Pauses: Utilize 0G cross-chain messaging to allow Sentinels on 0G Network to trigger emergency pauses on Ethereum Mainnet, Arbitrum, and Base.
- Decentralized ERC-7857 Marketplace: Buy, rent, stake, and compose high-reputation Sentinel agents with on-chain revenue sharing.
- $OG Staking & Slashing Mechanism: Require sentinels to stake $OG tokens to earn detection bounties, slashing stakes for unverified false alarms.
- AI Exploit Patch Synthesizer: Automatically generate verified Solidity hot-fix pull requests and security patches stored on 0G Storage alongside incident reports.
