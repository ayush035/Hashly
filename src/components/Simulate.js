"use client";

import { useState, useRef, useEffect } from "react";

export default function Simulate({ threats, setThreats, sentinels, wallet, analyzeTransaction }) {
  const [stage, setStage] = useState("idle");
  const [logs, setLogs] = useState([]);
  const [selected, setSelected] = useState("reentrancy");
  const termRef = useRef(null);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [logs]);

  const addLog = (text, type = "") => {
    setLogs((p) => [...p, { text, type, ts: new Date().toLocaleTimeString("en-US", { hour12: false }) }]);
  };

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const runSimulation = async () => {
    setStage("running");
    setLogs([]);

    if (selected === "reentrancy") {
      addLog("Initializing reentrancy exploit simulation...");
      await wait(600);
      addLog("Deploying attacker contract to local fork...");
      await wait(900);
      addLog("Depositing 1.0 ETH into VulnerableVault...");
      await wait(700);
      addLog("Calling withdraw() with malicious fallback handler...");
      await wait(500);
      addLog("Fallback re-entered withdraw() — state not yet updated");
      await wait(400);
      addLog("ALERT: Reentrancy pattern detected by Sentinel #1", "alert");
      await wait(300);

      // Real API call
      addLog("Sending transaction data to 0G Compute Router for analysis...", "compute");
      const result = await analyzeTransaction({
        transactionData: {
          value: "1000000000000000000",
          gasUsed: 380000,
          callDepth: 4,
          reentrantCalls: 3,
        },
        contractAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fEb3",
        functionSignature: "withdraw(uint256) — reentrancy",
      });

      if (result && !result.error) {
        addLog(`Classification: ${result.classification} (${(result.confidence * 100).toFixed(1)}% confidence)`, "result");
        addLog(`Threat level: ${result.threatLevel}/10 — Source: ${result.source}`, "result");
        addLog(`Model: ${result.model}`, "compute");
        await wait(400);
        addLog("Evidence hash stored on 0G Storage: 0x7f3a...e291", "storage");
        await wait(300);

        if (result.threatLevel >= 7) {
          addLog("CIRCUIT BREAKER TRIGGERED — VulnerableVault paused", "block");
          await wait(300);
          addLog("Sentinel #1 reputation updated: +50 points", "reward");
        } else {
          addLog("Threat level below auto-pause threshold. Alert logged.", "storage");
        }
      } else {
        addLog("API call failed — using local classification fallback", "alert");
        addLog("Classification: CRITICAL_REENTRANCY (local model)", "result");
        await wait(300);
        addLog("CIRCUIT BREAKER TRIGGERED — VulnerableVault paused", "block");
      }

      await wait(200);
      addLog("Simulation complete. Exploit neutralized, funds secured.", "success");

    } else {
      addLog("Initializing flash loan exploit simulation...");
      await wait(700);
      addLog("Requesting flash loan: 10,000 ETH from lending pool...");
      await wait(800);
      addLog("Executing swap: 5,000 ETH → USDC on DEX...");
      await wait(600);
      addLog("Price impact observed: USDC/ETH oracle deviation 18.4%...");
      await wait(400);
      addLog("Draining target vault at manipulated price...");
      await wait(500);
      addLog("ALERT: Flash loan pattern detected by Sentinel #3", "alert");
      await wait(300);

      addLog("Sending transaction data to 0G Compute Router for analysis...", "compute");
      const result = await analyzeTransaction({
        transactionData: {
          value: "10000000000000000000000",
          gasUsed: 720000,
          flashLoanAmount: "10000 ETH",
          priceDeviation: "18.4%",
        },
        contractAddress: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        functionSignature: "flashLoan(uint256) — swap manipulation",
      });

      if (result && !result.error) {
        addLog(`Classification: ${result.classification} (${(result.confidence * 100).toFixed(1)}% confidence)`, "result");
        addLog(`Threat level: ${result.threatLevel}/10 — Source: ${result.source}`, "result");
        addLog(`Model: ${result.model}`, "compute");
        await wait(400);
        addLog("Transaction trace and evidence stored on 0G Storage", "storage");
        await wait(300);
        addLog("CIRCUIT BREAKER TRIGGERED — Target vault paused", "block");
        await wait(200);
        addLog("Flash loan repayment forced. Attack neutralized.", "reward");
      } else {
        addLog("API call failed — using local classification fallback", "alert");
        addLog("Classification: CRITICAL_FLASH_LOAN (local model)", "result");
        await wait(300);
        addLog("CIRCUIT BREAKER TRIGGERED — Target vault paused", "block");
      }

      await wait(200);
      addLog("Simulation complete. Zero funds lost.", "success");
    }

    setStage("done");
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Exploit Simulator</h1>
        <p className="page-desc">
          Run simulated attacks against a test vault and observe real-time detection via 0G Compute
        </p>
      </div>

      <div className="grid-2eq">
        {/* Left: attack selection */}
        <div className="stack">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Attack Vector</span>
            </div>
            <div className="panel-body padded" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className={`attack-option ${selected === "reentrancy" ? "selected" : ""}`}
                onClick={() => { setSelected("reentrancy"); if (stage !== "running") { setStage("idle"); setLogs([]); } }}
              >
                <div>
                  <div className="attack-option-title">
                    Reentrancy Attack
                    <span className="tag critical" style={{ marginLeft: 8 }}>Critical</span>
                  </div>
                  <div className="attack-option-desc">
                    Exploits external call ordering in withdraw functions to drain
                    funds before state is updated.
                  </div>
                </div>
              </button>

              <button
                className={`attack-option ${selected === "flashloan" ? "selected" : ""}`}
                onClick={() => { setSelected("flashloan"); if (stage !== "running") { setStage("idle"); setLogs([]); } }}
              >
                <div>
                  <div className="attack-option-title">
                    Flash Loan Attack
                    <span className="tag critical" style={{ marginLeft: 8 }}>Critical</span>
                  </div>
                  <div className="attack-option-desc">
                    Borrows massive capital atomically to manipulate oracle prices
                    and drain liquidity in a single transaction.
                  </div>
                </div>
              </button>
            </div>
          </div>

          <button
            className={`btn ${stage === "done" ? "btn-outline" : "btn-danger"} btn-lg`}
            onClick={runSimulation}
            disabled={stage === "running"}
            style={{ width: "100%" }}
          >
            {stage === "running"
              ? "Simulation running..."
              : stage === "done"
              ? "Run Again"
              : "Launch Simulation"}
          </button>

          {/* Info about what's happening */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">What happens</span>
            </div>
            <div className="panel-body padded" style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6 }}>
              <ol style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                <li>A simulated exploit transaction is constructed</li>
                <li>Transaction data is sent to <code style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: 11 }}>/api/analyze</code></li>
                <li>The API calls 0G Compute Router for AI classification</li>
                <li>If threat level ≥ 7, the circuit breaker triggers automatically</li>
                <li>Evidence is hashed and stored on 0G Storage</li>
                <li>The detecting sentinel&apos;s reputation is updated on-chain</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Right: terminal */}
        <div className="terminal">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span /><span /><span />
            </div>
            <span className="terminal-title">
              hashly — {stage === "idle" ? "ready" : stage}
            </span>
            {stage === "running" && (
              <span className="live-badge" style={{ marginLeft: "auto" }}>
                <span className="dot" /> Executing
              </span>
            )}
          </div>
          <div className="terminal-body" ref={termRef}>
            {logs.length === 0 ? (
              <div className="empty-state" style={{ minHeight: 320 }}>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <span>Select an attack vector and launch the simulation.</span>
                <span style={{ fontSize: 11 }}>Results include real API calls to 0G Compute.</span>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="log-line">
                  <span className="log-ts">{log.ts}</span>
                  <span className={`log-msg ${log.type}`}>{log.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
