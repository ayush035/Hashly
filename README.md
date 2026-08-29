# 🛡️ Sentin0G — Autonomous DeFi Security Guardians

> **Autonomous AI security agents that detect and prevent DeFi exploits in real-time, tokenized as ERC-7857 Agentic IDs on 0G Network.**

Built for the [0G Bridge Buildathon by AKINDO](https://build.0g.ai/) — Wave 1 Submission.

![License](https://img.shields.io/badge/license-MIT-blue)
![0G Chain](https://img.shields.io/badge/0G-Newton%20Testnet-cyan)
![ERC-7857](https://img.shields.io/badge/ERC--7857-Agentic%20ID-purple)

---

## 🚀 What is Sentin0G?

**Sentin0G** deploys AI-powered Sentinel agents that continuously monitor smart contracts for reentrancy, flash loan, and oracle manipulation attacks. When an exploit is detected, Sentinels reach swarm consensus and execute automated circuit-breaker pauses on-chain — protecting protocols before damage occurs.

### The Problem

Over **$2B is lost annually** to DeFi exploits. Traditional security tools merely alert humans via Discord/Telegram, taking 15–45 minutes to respond — far too slow when a hacker's transaction executes in 12 seconds.

### The Solution

Autonomous AI Security Guardians that:
- 🔍 **Detect** exploits in real-time using AI inference on **0G Compute**
- 🛡️ **Block** attacks by triggering circuit-breaker pauses on **0G Chain**
- 🤖 **Evolve** as tokenized agents (ERC-7857 **Agentic IDs**) that improve with each detection
- 💾 **Store** exploit evidence and patterns on **0G Storage**

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│              SENTIN0G DASHBOARD                  │
│           (Next.js + ethers.js)                  │
│                                                  │
│  📊 Dashboard  │  🤖 Sentinels  │  ⚡ Simulate  │
└──────┬─────────────┬────────────────┬────────────┘
       │             │                │
  ┌────▼─────────────▼────────────────▼────────────┐
  │             BACKEND API (Next.js Routes)       │
  │                                                │
  │  ┌────────────┐ ┌────────────┐ ┌─────────────┐│
  │  │0G Compute  │ │0G Storage  │ │ 0G Chain    ││
  │  │Router API  │ │(Exploit DB)│ │ (Contracts) ││
  │  │AI Inference│ │Evidence    │ │ Circuit Brk ││
  │  └────────────┘ └────────────┘ └─────────────┘│
  └────────────────────────────────────────────────┘
```

---

## 🔗 0G Components Used

| Component | Usage | Details |
|:--|:--|:--|
| **0G Chain** | Smart contracts on Newton Testnet | SentinelRegistry, ProtocolGuard, VulnerableVault |
| **0G Compute** | AI inference for exploit classification | OpenAI-compatible Router API at `router-api-testnet.integratenetwork.work/v1` |
| **0G Storage** | Exploit pattern DB & evidence logs | Storing detection evidence and Sentinel metadata |
| **ERC-7857 (Agentic ID)** | Tokenized AI Sentinel agents | SentinelRegistry implements ERC-7857 patterns for ownable, evolving AI agents |

---

## 📦 Smart Contracts

### SentinelRegistry.sol (ERC-7857 Agentic ID)
- Mint Sentinel agents as tokenized Agentic IDs
- Dynamic reputation system (Scout → Guardian → Warden → Overlord)
- Encrypted metadata URI pointing to 0G Storage
- Secure transfer with operator authorization

### ProtocolGuard.sol (Circuit Breaker)
- Register protocols for Sentinel monitoring
- Automated circuit-breaker triggers on high-severity threats
- Alert management with evidence chain
- Integration with SentinelRegistry for reputation updates

### VulnerableVault.sol (Demo Target)
- Intentionally vulnerable DeFi vault for demo
- Contains reentrancy vulnerability for Sentinel detection showcase

---

## 🖥️ Local Setup

### Prerequisites
- Node.js 20+
- MetaMask browser extension
- 0G testnet tokens ([Faucet](https://faucet.0g.ai))

### Installation

```bash
# Clone the repository
git clone https://github.com/ayush035/Hashly.git
cd Hashly

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your keys (see .env.example for details)

# Compile smart contracts
npx hardhat compile

# Run development server
npm run dev
```

### Deploy Contracts to 0G Testnet

```bash
# Add your private key to .env
# Get testnet tokens from https://faucet.0g.ai

npx hardhat run scripts/deploy.js --network 0g-testnet
```

### Environment Variables

```env
PRIVATE_KEY=your_wallet_private_key
ZG_COMPUTE_API_KEY=your_0g_compute_api_key  # from pc.testnet.0g.ai
NEXT_PUBLIC_CHAIN_ID=16600
NEXT_PUBLIC_RPC_URL=https://evmrpc-testnet.0g.ai
```

---

## 🎮 Features

### 📊 Threat Dashboard
Real-time monitoring with live threat feed, risk heatmap, and animated statistics.

### 🤖 Sentinel Agents
Mint, browse, and manage AI security agents. Watch their reputation evolve as they detect threats.

### ⚡ Exploit Simulator
Simulate real DeFi attacks (reentrancy, flash loans) and watch Sentinels detect and neutralize them in real-time.

---

## 🛠️ Tech Stack

| Layer | Technology |
|:--|:--|
| Frontend | Next.js 15 (App Router) |
| Styling | Custom CSS Design System |
| Wallet | ethers.js v6 + MetaMask |
| Smart Contracts | Solidity 0.8.20 + Hardhat 3 |
| AI Inference | 0G Compute Router API |
| Storage | 0G Storage |
| Blockchain | 0G Chain (Newton Testnet) |

---

## 📊 Submission Details

- **Project:** Sentin0G
- **Wave:** 1
- **Buildathon:** 0G Bridge by AKINDO
- **Hashtags:** #0GBridge #BuildOn0G
- **Tags:** @0G_labs @0G_Builders @AKINDO_io

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with 🛡️ on <a href="https://0g.ai">0G Network</a>
</p>
