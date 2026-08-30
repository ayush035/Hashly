# 🎙️ Hashly — 5-Minute Video Walkthrough Script
### *0G Bridge Buildathon by AKINDO (Wave 1 Submission)*

---

## ⏱️ Video Structure Overview

| Section | Timestamp | Focus Area | Visuals & Actions |
|---|---|---|---|
| **Scene 1** | `0:00 – 0:45` | Hook & The $2B DeFi Problem | Landing Page Hero, stats, problem context |
| **Scene 2** | `0:45 – 1:30` | Introducing Hashly & The 0G Stack | Architecture section, 4 pillars of 0G |
| **Scene 3** | `1:30 – 2:30` | ERC-7857 Tokenized AI Sentinels | Wallet connect to 0G Galileo, minting an agent |
| **Scene 4** | `2:30 – 4:00` | Live Exploit Simulation & 0G Telemetry | Exploit simulator, 0G Compute & Storage live trace |
| **Scene 5** | `4:00 – 5:00` | Wave 1 Recap, Future Roadmap & Wrap-up | Threat Feed, Contracts, Wave 2/3 Vision |

---

## 🎬 Detailed Storyboard & Script

---

### 📍 Scene 1: Hook & The $2B DeFi Problem
**⏱️ Time:** `0:00 – 0:45`  
**🖥️ On-Screen Action:**  
- Start on the **Hashly Landing Page** (`http://localhost:3000`).
- Slowly hover over the headline: *"Autonomous AI Security & Instant Circuit Breakers for DeFi"*.
- Scroll down slightly to show the feature cards highlighting **Sub-Second Detection**, **Decentralized AI**, and **On-Chain Circuit Breakers**.

**🎙️ Voiceover:**
> *"Over $2 Billion is lost annually to smart contract exploits in DeFi. Reentrancy loops, flash loan price distortions, and oracle manipulations execute in mere seconds.*
> 
> *Yet today, protocol security is fundamentally broken. Traditional monitoring tools merely send webhook notifications to Telegram or Discord. By the time a security engineer wakes up, reviews the alert, and coordinates a multi-sig transaction to pause a vault—which takes 15 to 45 minutes—the liquidity is already drained and bridged away.*
> 
> *DeFi moves at machine speed. Human-in-the-loop security is simply too slow.*
> 
> *Meet **Hashly**—an autonomous, decentralized AI security and circuit breaker network built natively on the 0G ecosystem."*

---

### 📍 Scene 2: Introducing Hashly & The 0G Full-Stack
**⏱️ Time:** `0:45 – 1:30`  
**🖥️ On-Screen Action:**  
- Scroll down to the **Architecture Diagram** and the **Autonomous Sentinel Telemetry Console** on the landing page.
- Mouse over the 4 telemetry badges: **0G Compute Router**, **ProtocolGuard Circuit Breaker**, **0G Storage Flow**, and **ERC-7857 Agentic IDs**.

**🎙️ Voiceover:**
> *"Hashly acts as an automated, cryptographic immune system for smart contracts. Instead of passive alerts, Hashly closes the loop between AI inference, forensic storage, and on-chain execution using all four pillars of the 0G modular AI network:*
> 
> *First, **0G Compute**: raw transaction execution traces are analyzed by decentralized LLMs with sub-second latency.*
> 
> *Second, **0G Storage**: every incident payload and AI reasoning log is cryptographically hashed and anchored into permanent, decentralized storage via the official 0G Storage TS-SDK.*
> 
> *Third, **0G Chain**: high-throughput EVM smart contracts verify threat scores and trip automated circuit breakers within the same block.*
> 
> *And fourth, **ERC-7857 Agentic IDs**: our security agents are tokenized on-chain identities that evolve and earn reputation with every verified threat detection.*
> 
> *Let's launch the dApp and see it in action."*

---

### 📍 Scene 3: Tokenized AI Sentinels (ERC-7857 on 0G Galileo)
**⏱️ Time:** `1:30 – 2:30`  
**🖥️ On-Screen Action:**  
- Click **"Launch App"** to enter the Dashboard (`/dashboard`).
- Show the top-right wallet connected to **0G Galileo Testnet (Chain ID 16602)**.
- Navigate to the **"Sentinels"** tab in the sidebar.
- Show the live on-chain agents already minted (e.g., `Alpha Sentinel`, `Alpha2`).
- Click **"Deploy New Sentinel"** to open the Agent Deployment modal.
- Type in:
  - **Name:** `Vanguard Sentinel`
  - **Specialization:** Select `Reentrancy & Flash Loan Defense`
  - **Description:** `Autonomous sentinel monitoring recursive call patterns on 0G vaults.`
  - **System Prompt:** Leave custom security instructions.
- Click **"Deploy On-Chain (ERC-7857)"** $\to$ MetaMask pops up $\to$ Confirm transaction on 0G Galileo $\to$ Show confirmation toast and the newly minted agent card appearing in the grid.

**🎙️ Voiceover:**
> *"Here on the Sentinels dashboard, every security guardian is an on-chain ERC-7857 Agentic ID deployed to the 0G Galileo testnet.*
> 
> *Unlike traditional static bots, each Sentinel has a distinct specialization, customizable system prompts, and a dynamic reputation tier—advancing from Scout to Guardian, Warden, and Overlord as it successfully defends protocols.*
> 
> *When deploying a Sentinel, its behavioral prompt and specialization are encoded into an on-chain metadata URI stored directly in the contract. Once deployed, the sentinel joins the decentralized swarm monitoring 0G smart contracts."*

---

### 📍 Scene 4: Live Exploit Simulation & Real 0G Telemetry
**⏱️ Time:** `2:30 – 4:00`  
**🖥️ On-Screen Action:**  
- Navigate to the **"Simulate"** tab in the sidebar.
- Select the **"Reentrancy Attack"** vector against the deployed `VulnerableVault` contract (`0x6771...7908C5`).
- Click **"Launch Simulation"**.
- Keep camera focused on the live streaming terminal logs as it executes line by line:
  1. *Interception:* `ALERT: Reentrancy pattern detected by Sentinel`
  2. *0G Compute:* `Sending transaction data to 0G Compute Router for analysis...`
  3. *Live AI Classification:*
     - `Classification: CRITICAL_REENTRANCY (95.0% confidence)`
     - `Threat Level: 8/10`
     - `AI Reasoning: "The function withdraw has multiple reentrancy calls detected within its execution flow."`
     - `0G Model: qwen2.5-omni`
     - `0G Provider: 0xa48f01287233509FD694a22Bf840225062E67836`
     - `Tokens Used: 128 (prompt: 42, completion: 86)`
     - `Compute Cost: 700610000000000 a0gi`
  4. *0G Storage:* `Evidence stored on 0G Storage: 0x8fa9c7b2...`
  5. *0G Chain Circuit Breaker:* `ProtocolGuard.raiseAlert() -> Target Vault PAUSED`
  6. *Reputation:* `Sentinel reputation updated on-chain: +detection recorded`
- Navigate to the **"Dashboard"** tab to show the new alert logged in the **Live Threat Feed** with its 0G Storage Merkle root and updated threat counter.

**🎙️ Voiceover:**
> *"Now let's demonstrate the full end-to-end security loop in our interactive Exploit Simulator.*
> 
> *We'll launch a reentrancy attack against our live `VulnerableVault` contract deployed on 0G Galileo.*
> 
> *Watch the terminal in real time:*
> 
> *The sentinel immediately detects the abnormal call depth and recursive withdrawals. It dispatches the raw execution trace to the 0G Compute Router.*
> 
> *Here is the live decentralized AI response: the model classifies the transaction as `CRITICAL_REENTRANCY` with 95% confidence and a threat level of 8 out of 10. Notice the verifiable trace details: our exact 0G Node Provider address, the request ID, 128 tokens consumed, and the precise compute cost in a0gi.*
> 
> *Because the threat score exceeds our safety threshold of 7, two things happen instantaneously:*
> *First, the full forensic evidence payload is uploaded to **0G Storage**, generating an immutable Merkle root hash.*
> *Second, Hashly triggers `ProtocolGuard.raiseAlert()` on **0G Chain**, instantly tripping the circuit breaker and pausing the vulnerable vault.*
> 
> *The attack is neutralized before the hacker can withdraw funds, and the Sentinel's on-chain reputation increases. The whole process took under two seconds."*

---

### 📍 Scene 5: Wave 1 Recap, Future Roadmap & Conclusion
**⏱️ Time:** `4:00 – 5:00`  
**🖥️ On-Screen Action:**  
- Navigate to the **"Contracts"** section / show the deployed contracts on **0G Galileo Explorer** (`chainscan-galileo.0g.ai`).
- Switch back to the presentation slides / README showing the **Wave 2 & Wave 3 Roadmap**.
- Show the GitHub repository with clean documentation and logo.

**🎙️ Voiceover:**
> *"In Wave 1 of the 0G Bridge Buildathon, we have successfully delivered:*
> - *A full suite of smart contracts deployed on 0G Galileo Testnet,*
> - *Live AI threat classification via 0G Compute,*
> - *Permanent forensic anchoring on 0G Storage,*
> - *ERC-7857 tokenized Agentic IDs with dynamic on-chain reputation,*
> - *And an interactive simulator demonstrating autonomous circuit breakers.*
> 
> *Looking ahead to Wave 2 and Wave 3:*
> - *In **Wave 2**, we are introducing **Multi-Agent Swarm Consensus** where multiple sentinels must cross-verify threats, a **Headless Node Daemon** for 24/7 mempool listening, and **zk-inference verification**.*
> - *In **Wave 3**, we will expand to **Cross-Chain Circuit Breakers** protecting Ethereum, Arbitrum, and Base, alongside an **ERC-7857 Agent Marketplace** and $OG staking mechanics.*
> 
> *Hashly is transforming DeFi security from reactive human triaging to autonomous, verifiable cryptographic immunity.*
> 
> *Thank you, and check out our live app and open-source code on GitHub!"*

---

## 🎯 Pro-Tips for Recording Your Screen:
1. **Resolution:** Record in `1920x1080` (1080p 60fps) for crisp code and UI text.
2. **Zoom Level:** Set browser zoom to `100%` or `110%` so typography in the terminal and sidebar is easy to read on mobile.
3. **Wallet:** Make sure your MetaMask is connected to `0G Galileo Testnet` (`16602`) with some faucet balance.
4. **Pacing:** Let the simulation terminal finish printing each log line before speaking to the next sentence—it highlights the real-time telemetry.
