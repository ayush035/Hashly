"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { SENTINEL_REGISTRY_ABI, CONTRACTS, TIER_LABELS, STATUS_LABELS } from "@/lib/contracts";

export default function Sentinels({ sentinels, setSentinels }) {
  const [mintName, setMintName] = useState("");
  const [txStatus, setTxStatus] = useState(""); // "", "pending", "confirming", "success", "error"
  const { address, isConnected } = useAccount();

  const registryAddr = CONTRACTS.sentinelRegistry;

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

  const handleMint = () => {
    if (!mintName.trim() || !isConnected || !registryAddr) return;

    setTxStatus("pending");
    writeContract({
      address: registryAddr,
      abi: SENTINEL_REGISTRY_ABI,
      functionName: "mintSentinel",
      args: [mintName.trim(), `hashly://sentinel/${mintName.trim().toLowerCase()}`],
    });
  };

  const tierOrder = { scout: 0, guardian: 1, warden: 2, overlord: 3 };

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
          <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 14, lineHeight: 1.5 }}>
            Create a new AI security sentinel as an on-chain Agentic ID. Each sentinel starts at the
            Scout tier and advances through Guardian, Warden, and Overlord based on successful detections.
          </p>
          {!isConnected && (
            <p style={{ fontSize: 12, color: "var(--yellow)", marginBottom: 12 }}>
              Connect your wallet to deploy a sentinel on-chain.
            </p>
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
            <p style={{ fontSize: 12, color: "var(--red)", marginBottom: 12, fontFamily: "var(--mono)" }}>
              Mint failed. {mintError?.shortMessage || "Check console for details."}
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
              disabled={txStatus === "pending" || txStatus === "confirming"}
            />
            <button
              className="btn btn-primary"
              onClick={handleMint}
              disabled={!isConnected || !mintName.trim() || txStatus === "pending" || txStatus === "confirming"}
            >
              {txStatus === "pending" ? "Confirm in wallet..." :
               txStatus === "confirming" ? "Confirming..." :
               "Deploy"}
            </button>
          </div>

          {totalCount !== undefined && (
            <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 8, fontFamily: "var(--mono)" }}>
              {Number(totalCount)} sentinels minted on-chain
            </p>
          )}
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
