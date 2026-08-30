"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, useSwitchChain } from "wagmi";
import { SENTINEL_REGISTRY_ABI, CONTRACTS, TIER_LABELS, STATUS_LABELS } from "@/lib/contracts";

export default function Sentinels({ sentinels, setSentinels }) {
  const [mintName, setMintName] = useState("");
  const [mintDesc, setMintDesc] = useState("");
  const [mintSpec, setMintSpec] = useState("general");
  const [mintPrompt, setMintPrompt] = useState("");
  const [txStatus, setTxStatus] = useState(""); // "", "pending", "confirming", "success", "error"
  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const registryAddr = CONTRACTS.sentinelRegistry;

  const SPECIALIZATIONS = [
    { value: "general", label: "General Security", desc: "Monitors all exploit vectors" },
    { value: "reentrancy", label: "Reentrancy Detection", desc: "Specializes in recursive call patterns" },
    { value: "flash_loan", label: "Flash Loan Defense", desc: "Detects atomic borrow-manipulate-repay" },
    { value: "oracle", label: "Oracle Manipulation", desc: "Monitors price feed deviations" },
    { value: "access_control", label: "Access Control", desc: "Watches for privilege escalation" },
  ];

  // Write: mint sentinel
  const { writeContract, data: mintTxHash, isPending: isMintPending, error: mintError } = useWriteContract();

  // Wait for tx confirmation
  const { isLoading: isConfirming, isSuccess: isMintConfirmed } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  });

  // Read: total sentinels count
  const { data: totalCount, refetch: refetchTotal } = useReadContract({
    address: registryAddr,
    abi: SENTINEL_REGISTRY_ABI,
    functionName: "totalSentinels",
    query: { enabled: !!registryAddr },
  });

  // Read: user's sentinel IDs
  const { data: ownerTokenIds, refetch: refetchOwner } = useReadContract({
    address: registryAddr,
    abi: SENTINEL_REGISTRY_ABI,
    functionName: "getOwnerSentinels",
    args: [address],
    query: { enabled: !!registryAddr && !!address },
  });

  // Fetch sentinel details for each token ID
  useEffect(() => {
    if (!ownerTokenIds || !registryAddr) return;

    async function fetchSentinels() {
      const fetched = [];
      for (const tokenId of ownerTokenIds) {
        try {
          const res = await fetch(`/api/sentinel?tokenId=${tokenId}`);
          const data = await res.json();
          if (data.sentinel) {
            fetched.push(data.sentinel);
          }
        } catch {
          // Skip failed fetches
        }
      }
      if (fetched.length > 0) {
        setSentinels(fetched);
      }
    }

    fetchSentinels();
  }, [ownerTokenIds, registryAddr, setSentinels]);

  // Handle mint confirmation
  useEffect(() => {
    if (isMintConfirmed) {
      setTxStatus("success");
      setMintName("");
      setMintDesc("");
      setMintPrompt("");
      setMintSpec("general");
      // Refetch data after successful mint
      refetchTotal();
      refetchOwner();

      // Clear success message after 5 seconds
      const timer = setTimeout(() => setTxStatus(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [isMintConfirmed, refetchTotal, refetchOwner]);

  useEffect(() => {
    if (mintError) {
      setTxStatus("error");
      console.error("Mint error:", mintError);
    }
  }, [mintError]);

  useEffect(() => {
    if (isMintPending) setTxStatus("pending");
    else if (isConfirming) setTxStatus("confirming");
  }, [isMintPending, isConfirming]);

  const handleMint = async () => {
    if (!mintName.trim() || !isConnected || !registryAddr) return;

    if (chain && chain.id !== 16602 && switchChain) {
      try {
        await switchChain({ chainId: 16602 });
      } catch (err) {
        console.error("Network switch rejected:", err);
        return;
      }
    }

    // Build metadata JSON as the URI
    const metadata = {
      name: mintName.trim(),
      description: mintDesc.trim() || `${mintName.trim()} - Hashly security sentinel`,
      specialization: mintSpec,
      systemPrompt: mintPrompt.trim() || `You are ${mintName.trim()}, an autonomous DeFi security agent specialized in ${SPECIALIZATIONS.find(s => s.value === mintSpec)?.label || "general security"}. Monitor transactions for exploit patterns and report threats.`,
      version: "hashly-v1",
      created: new Date().toISOString(),
    };

    const metadataURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

    setTxStatus("pending");
    writeContract({
      address: registryAddr,
      abi: SENTINEL_REGISTRY_ABI,
      functionName: "mintSentinel",
      args: [mintName.trim(), metadataURI],
      chainId: 16602,
    });
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Sentinel Agents</h1>
        <p className="page-desc">ERC-7857 Agentic IDs - autonomous security agents that evolve on-chain</p>
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
          <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 16, lineHeight: 1.5 }}>
            Configure and deploy a new AI security sentinel as an on-chain Agentic ID. Define its
            specialization and system prompt to shape its threat detection behavior.
          </p>
          {!isConnected && (
            <p style={{ fontSize: 12, color: "var(--yellow)", marginBottom: 12 }}>
              Connect your wallet to deploy a sentinel on-chain.
            </p>
          )}

          {isConnected && chain && chain.id !== 16602 && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10
            }}>
              <span style={{ fontSize: 12, color: "var(--red)" }}>
                Wrong Network: Connected to <strong>{chain.name || `Chain #${chain.id}`}</strong>. Please switch to 0G Galileo Testnet (Chain ID 16602).
              </span>
              <button
                className="btn btn-primary"
                style={{ padding: "4px 12px", fontSize: 12, flexShrink: 0 }}
                onClick={() => switchChain?.({ chainId: 16602 })}
              >
                Switch to 0G
              </button>
            </div>
          )}

          {/* Status messages */}
          {txStatus === "pending" && (
            <p style={{ fontSize: 12, color: "var(--accent)", marginBottom: 12, fontFamily: "var(--mono)" }}>
              Waiting for wallet confirmation...
            </p>
          )}
          {txStatus === "confirming" && (
            <p style={{ fontSize: 12, color: "var(--yellow)", marginBottom: 12, fontFamily: "var(--mono)" }}>
              Transaction submitted. Waiting for on-chain confirmation...
            </p>
          )}
          {txStatus === "success" && (
            <p style={{ fontSize: 12, color: "var(--green)", marginBottom: 12, fontFamily: "var(--mono)" }}>
              Sentinel minted successfully on 0G Galileo.
              {mintTxHash && (
                <a
                  href={`https://chainscan-galileo.0g.ai/tx/${mintTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent)", marginLeft: 8 }}
                >
                  View tx
                </a>
              )}
            </p>
          )}
          {txStatus === "error" && (
            <div style={{ marginBottom: 12, fontSize: 12, color: "var(--red)", fontFamily: "var(--mono)" }}>
              <p>Mint failed: {mintError?.shortMessage || mintError?.message || "Transaction error. Ensure you are on 0G Galileo Testnet."}</p>
              {chain && chain.id !== 16602 && (
                <button
                  className="btn btn-outline"
                  style={{ marginTop: 8, fontSize: 11 }}
                  onClick={() => switchChain?.({ chainId: 16602 })}
                >
                  Switch Network to 0G Galileo
                </button>
              )}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Row 1: Name + Specialization */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, color: "var(--text-3)", display: "block", marginBottom: 4, fontWeight: 600 }}>
                  Agent Name
                </label>
                <input
                  className="input"
                  type="text"
                  placeholder="e.g. Sentinel Alpha"
                  value={mintName}
                  onChange={(e) => setMintName(e.target.value)}
                  style={{ width: "100%" }}
                  disabled={txStatus === "pending" || txStatus === "confirming"}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "var(--text-3)", display: "block", marginBottom: 4, fontWeight: 600 }}>
                  Specialization
                </label>
                <select
                  className="input"
                  value={mintSpec}
                  onChange={(e) => setMintSpec(e.target.value)}
                  style={{ width: "100%", cursor: "pointer" }}
                  disabled={txStatus === "pending" || txStatus === "confirming"}
                >
                  {SPECIALIZATIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Description */}
            <div>
              <label style={{ fontSize: 11, color: "var(--text-3)", display: "block", marginBottom: 4, fontWeight: 600 }}>
                Description
              </label>
              <input
                className="input"
                type="text"
                placeholder="What does this sentinel monitor?"
                value={mintDesc}
                onChange={(e) => setMintDesc(e.target.value)}
                style={{ width: "100%" }}
                disabled={txStatus === "pending" || txStatus === "confirming"}
              />
            </div>

            {/* Row 3: System Prompt */}
            <div>
              <label style={{ fontSize: 11, color: "var(--text-3)", display: "block", marginBottom: 4, fontWeight: 600 }}>
                System Prompt <span style={{ fontWeight: 400, color: "var(--text-3)" }}>(optional - defines agent behavior)</span>
              </label>
              <textarea
                className="input"
                placeholder={`You are an autonomous DeFi security agent specialized in ${SPECIALIZATIONS.find(s => s.value === mintSpec)?.label || "general security"}. Monitor all transactions for exploit patterns and raise alerts when suspicious activity is detected.`}
                value={mintPrompt}
                onChange={(e) => setMintPrompt(e.target.value)}
                rows={3}
                style={{ width: "100%", resize: "vertical", fontFamily: "var(--mono)", fontSize: 11, lineHeight: 1.6 }}
                disabled={txStatus === "pending" || txStatus === "confirming"}
              />
            </div>

            {/* Deploy button */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                className="btn btn-primary"
                onClick={handleMint}
                disabled={!isConnected || !mintName.trim() || txStatus === "pending" || txStatus === "confirming"}
                style={{ minWidth: 140 }}
              >
                {txStatus === "pending" ? "Confirm in wallet..." :
                 txStatus === "confirming" ? "Confirming..." :
                 "Deploy Sentinel"}
              </button>
              {totalCount !== undefined && (
                <span style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--mono)" }}>
                  {Number(totalCount)} sentinels on-chain
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid-3col">
        {sentinels.map((s) => {
          const tier = typeof s.tier === "number" ? TIER_LABELS[s.tier] : s.tier;
          const status = typeof s.status === "number" ? STATUS_LABELS[s.status] : s.status;
          const rep = typeof s.reputation === "bigint" ? Number(s.reputation) : s.reputation;
          const detections = typeof s.totalDetections === "bigint" ? Number(s.totalDetections) : (s.totalDetections || s.detections || 0);
          const fp = typeof s.falsePositives === "bigint" ? Number(s.falsePositives) : s.falsePositives;

          return (
            <div className="sentinel-card" key={s.id}>
              <div className="sentinel-top">
                <div className="sentinel-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                </div>
                <span className={`tag ${tier}`}>{tier}</span>
              </div>

              <div className="sentinel-name">{s.name}</div>
              <div className="sentinel-id">Agentic ID #{typeof s.id === "bigint" ? Number(s.id) : s.id}</div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>
                  <span>Reputation</span>
                  <span style={{ fontFamily: "var(--mono)" }}>{rep}</span>
                </div>
                <div className="progress">
                  <div className="progress-fill" style={{ width: `${Math.min(rep / 10, 100)}%` }} />
                </div>
              </div>

              <div className="sentinel-stats-grid">
                <div className="s-stat">
                  <div className="s-stat-label">Detections</div>
                  <div className="s-stat-value">{detections}</div>
                </div>
                <div className="s-stat">
                  <div className="s-stat-label">False Pos</div>
                  <div className="s-stat-value">{fp}</div>
                </div>
              </div>

              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                paddingTop: 10, borderTop: "1px solid var(--border)", marginTop: 10,
              }}>
                <span style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--mono)" }}>
                  {s.lastActive || (s.lastActiveAt ? new Date(Number(s.lastActiveAt) * 1000).toLocaleString() : "on-chain")}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="status-dot" />
                  <span style={{ fontSize: 10, fontWeight: 600, color: status === "active" ? "var(--green)" : "var(--yellow)", fontFamily: "var(--mono)" }}>
                    {status === "active" ? "ONLINE" : status?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
