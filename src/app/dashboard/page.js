"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import Sentinels from "@/components/Sentinels";
import Simulate from "@/components/Simulate";

export default function DashboardPage() {
  const [activePage, setActivePage] = useState("dashboard");
  const [threats, setThreats] = useState([]);
  const [sentinels, setSentinels] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const { address: wallet, isConnected } = useAccount();

  useEffect(() => {
    async function loadOnChainSentinels() {
      try {
        const res = await fetch("/api/sentinel");
        const data = await res.json();
        if (data.sentinels) {
          setSentinels(data.sentinels);
        }
      } catch (err) {
        console.error("Failed to load on-chain sentinels:", err);
      }
    }
    loadOnChainSentinels();
  }, []);

  const analyzeTransaction = useCallback(async (txData) => {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txData),
      });
      const result = await res.json();
      setAnalysisResults((prev) => [result, ...prev]);

      if (result.classification !== "SAFE") {
        const sevMap = {
          CRITICAL_REENTRANCY: "critical", CRITICAL_FLASH_LOAN: "critical",
          CRITICAL_ORACLE: "critical", CRITICAL_ACCESS: "critical", SUSPICIOUS: "medium",
        };
        setThreats((prev) => [{
          id: Date.now(),
          type: result.classification.replace(/_/g, " "),
          severity: sevMap[result.classification] || "medium",
          detail: result.reasoning?.slice(0, 100) || "Threat detected",
          status: result.threatLevel >= 7 ? "blocked" : "detected",
          time: "just now",
          source: result.source || "0g-compute",
          confidence: result.confidence,
        }, ...prev.slice(0, 19)]);
      }
      return result;
    } catch (err) {
      console.error("Analysis failed:", err);
      return { error: true, message: err.message };
    }
  }, []);

  const props = { threats, setThreats, sentinels, setSentinels, wallet, isConnected, analyzeTransaction, analysisResults };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        threatCount={threats.filter((t) => t.severity === "critical").length}
      />
      <main className="main-content">
        {activePage === "dashboard" && <Dashboard {...props} />}
        {activePage === "sentinels" && <Sentinels {...props} />}
        {activePage === "simulate" && <Simulate {...props} />}
      </main>
    </div>
  );
}
