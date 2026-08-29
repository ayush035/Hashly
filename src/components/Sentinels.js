"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

export default function Sentinels({ sentinels, setSentinels }) {
  const [mintName, setMintName] = useState("");
  const [minting, setMinting] = useState(false);
  const { isConnected } = useAccount();

  const handleMint = async () => {
    if (!mintName.trim()) return;
    setMinting(true);

    // TODO: Replace with real contract call once deployed
    // const { writeContract } = useWriteContract();
    // writeContract({
    //   address: CONTRACTS.sentinelRegistry,
    //   abi: SENTINEL_REGISTRY_ABI,
    //   functionName: "mintSentinel",
    //   args: [mintName, "ipfs://..."],
    // });

    await new Promise((r) => setTimeout(r, 1800));
    setSentinels((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: mintName.trim(),
        tier: "scout",
        reputation: 100,
        detections: 0,
        falsePositives: 0,
        status: "active",
        lastActive: "now",
      },
    ]);
    setMintName("");
    setMinting(false);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Sentinel Agents</h1>
        <p className="page-desc">ERC-7857 Agentic IDs — autonomous security agents that evolve on-chain</p>
      </div>

      {/* Mint */}
      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="panel-header">
          <span className="panel-title">Deploy New Sentinel</span>
          <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--text-3)" }}>
            ERC-7857 · 0G Chain
          </span>
        </div>
        <div className="panel-body padded">
          <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 14, lineHeight: 1.5 }}>
            Create a new AI security sentinel as an on-chain Agentic ID. Each sentinel starts at the
            Scout tier and advances through Guardian, Warden, and Overlord based on successful detections.
          </p>
          {!isConnected && (
            <p style={{ fontSize: 12, color: "var(--yellow)", marginBottom: 12 }}>
              Connect your wallet to deploy a sentinel on-chain.
            </p>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <input
              className="input"
              type="text"
              placeholder="Sentinel name"
              value={mintName}
              onChange={(e) => setMintName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleMint()}
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-primary"
              onClick={handleMint}
              disabled={minting || !mintName.trim()}
            >
              {minting ? "Deploying..." : "Deploy"}
            </button>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid-3col">
        {sentinels.map((s) => (
          <div className="sentinel-card" key={s.id}>
            <div className="sentinel-top">
              <div className="sentinel-icon">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              </div>
              <span className={`tag ${s.tier}`}>{s.tier}</span>
            </div>

            <div className="sentinel-name">{s.name}</div>
            <div className="sentinel-id">Agentic ID #{s.id}</div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>
                <span>Reputation</span>
                <span style={{ fontFamily: "var(--mono)" }}>{s.reputation}</span>
              </div>
              <div className="progress">
                <div className="progress-fill" style={{ width: `${Math.min(s.reputation / 10, 100)}%` }} />
              </div>
            </div>

            <div className="sentinel-stats-grid">
              <div className="s-stat">
                <div className="s-stat-label">Detections</div>
                <div className="s-stat-value">{s.detections}</div>
              </div>
              <div className="s-stat">
                <div className="s-stat-label">False Pos</div>
                <div className="s-stat-value">{s.falsePositives}</div>
              </div>
            </div>

            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              paddingTop: 10, borderTop: "1px solid var(--border)", marginTop: 10,
            }}>
              <span style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--mono)" }}>
                Active {s.lastActive}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span className="status-dot" />
                <span style={{ fontSize: 10, fontWeight: 600, color: "var(--green)", fontFamily: "var(--mono)" }}>
                  ONLINE
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
