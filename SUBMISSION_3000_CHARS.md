Hashly: Autonomous AI DeFi Security & Circuit Breaker Network on 0G

Tagline:
Autonomous on-chain security intercepting DeFi exploits in real time using 0G Compute for AI classification, 0G Storage for evidence proofs, and ERC-7857 Agentic IDs for automated circuit breakers on 0G Chain.

Problem & Solution:
DeFi loses over $2B annually to exploits (reentrancy, flash loans, oracle drift). Traditional alerts (Discord/Telegram bots) take 15-45 minutes—far too slow when attacks execute in seconds. Hashly replaces passive alerts with an autonomous cryptographic immune system that analyzes execution traces on decentralized AI and trips on-chain pauses in <2 seconds.

How 4 0G Components Are Used:
1. 0G Chain (Galileo 16602): High-speed EVM layer executing SentinelRegistry, ProtocolGuard, and target vaults with sub-2s block finality.
2. 0G Compute Router: Decentralized zero-shot LLM inference (qwen2.5-omni) analyzing raw call depth, gas spikes, and slippage to classify threats (1-10 score) with verifiable node provider and token telemetry.
3. 0G Storage: Anchors complete forensic telemetry via @0gfoundation/0g-storage-ts-sdk into decentralized storage nodes, generating verifiable on-chain Merkle root hashes.
4. ERC-7857 Standard (Agentic IDs): Security sentinels are ownable, tokenized on-chain agents with custom system prompts and specializations that earn reputation (Scout -> Guardian -> Warden -> Overlord) on verified detections.

Deployed Smart Contracts (0G Galileo Testnet 16602):
- SentinelRegistry (ERC-7857): 0x01F9d2D5A4eA2BA7139D599b4f6B6D06cCB34bcE
  https://chainscan-galileo.0g.ai/address/0x01F9d2D5A4eA2BA7139D599b4f6B6D06cCB34bcE
- ProtocolGuard (Circuit Breaker): 0x6224d82ab9bE92d4eCF116D8cafC13d078B83aFC
  https://chainscan-galileo.0g.ai/address/0x6224d82ab9bE92d4eCF116D8cafC13d078B83aFC
- VulnerableVault (Demo Target): 0x67717afbCa0c2A4E060B2Ef0621bF33ef07908C5
  https://chainscan-galileo.0g.ai/address/0x67717afbCa0c2A4E060B2Ef0621bF33ef07908C5

Everything Built in Wave 1:
- Smart Contracts: ERC-7857 registry, circuit breaker, and demo vault deployed to 0G Galileo.
- 0G Compute Pipeline: Server-side AI analysis (/api/analyze) with verifiable trace/cost telemetry.
- 0G Storage Evidence Vault: TS-SDK integration (/api/storage) generating Merkle proof hashes.
- ERC-7857 Agent Management: Form to mint on-chain agents with system prompts and dynamic tier badges.
- Exploit Simulator: Interactive testbed executing live Reentrancy and Flash Loan attacks with real-time terminal logs and auto-pausing.
- Production dApp: Next.js 15, Wagmi v2, RainbowKit, multi-RPC fallback, and 0G Galileo network switcher.

Links:
- Live Demo: https://hashlybeta.vercel.app/
- Demo Video: https://youtu.be/6OXf7KV6jTg
- GitHub Repo: https://github.com/ayush035/Hashly
