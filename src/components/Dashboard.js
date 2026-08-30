"use client";

import { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";
import { TIER_LABELS } from "@/lib/contracts";

const CHART_COLORS = {
  indigo: "#6366f1",
  purple: "#8b5cf6",
  red: "#ef4444",
  orange: "#f97316",
  yellow: "#eab308",
  green: "#22c55e",
};

const PIE_COLORS = ["#ef4444", "#f97316", "#eab308", "#6366f1", "#22c55e"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#18181b", border: "1px solid #27272a", borderRadius: 6,
      padding: "8px 12px", fontSize: 11, fontFamily: "var(--mono)",
    }}>
      <div style={{ color: "#a1a1aa", marginBottom: 2 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function Dashboard({ threats, sentinels, analyzeTransaction }) {
  const [stats, setStats] = useState({ blocked: 0, detected: 0, protocols: 0, uptime: 0 });
  const [onChainStats, setOnChainStats] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  // Fetch real on-chain stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (data.totalAlerts !== undefined) {
          setOnChainStats(data);
        }
      } catch {
        // Stats endpoint not available, use defaults
      }
    }
    fetchStats();
  }, [threats]); // refetch when threats change (after simulation)

  // Animate counters (blend real on-chain data with demo stats)
  useEffect(() => {
    const chainAlerts = onChainStats?.totalAlerts || 0;
    const chainSentinels = onChainStats?.totalSentinels || 0;
    const targets = {
      blocked: chainAlerts + threats.filter(t => t.status === "blocked").length,
      detected: chainAlerts + threats.length,
      protocols: onChainStats?.protocolCount || 1,
      uptime: 99.7,
    };
    const steps = 30;
    let step = 0;
    const t = setInterval(() => {
      step++;
      const p = 1 - Math.pow(1 - step / steps, 3);
      setStats({
        blocked: Math.round(targets.blocked * p),
        detected: Math.round(targets.detected * p),
        protocols: Math.round(targets.protocols * p),
        uptime: +(targets.uptime * p).toFixed(1),
      });
      if (step >= steps) clearInterval(t);
    }, 40);
    return () => clearInterval(t);
  }, [onChainStats, threats]);


  const runQuickAnalysis = async () => {
    setAnalyzing(true);
    const result = await analyzeTransaction({
      transactionData: { value: "5000000000000000000", gasUsed: 380000, callDepth: 4 },
      contractAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fEb3",
      functionSignature: "withdraw(uint256)",
    });
    setLastResult(result);
    setAnalyzing(false);
  };

  // Chart data  - threat timeline (last 14 days)
  const timelineData = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        threats: Math.floor(Math.random() * 40) + 5,
        blocked: Math.floor(Math.random() * 15) + 2,
      });
    }
    return days;
  }, []);

  // Classification distribution data
  const classificationData = useMemo(() => [
    { name: "Reentrancy", value: 38 },
    { name: "Flash Loan", value: 24 },
    { name: "Oracle Manip.", value: 16 },
    { name: "Access Control", value: 12 },
    { name: "Safe", value: 52 },
  ], []);

  // Severity histogram
  const severityData = useMemo(() => [
    { level: "1-2", count: 45 },
    { level: "3-4", count: 32 },
    { level: "5-6", count: 28 },
    { level: "7-8", count: 18 },
    { level: "9-10", count: 7 },
  ], []);

  // Heatmap
  const heatmap = useMemo(() => Array.from({ length: 84 }, () => Math.floor(Math.random() * 6)), []);
  const heatmapColors = [
    "rgba(99,102,241,0.04)", "rgba(99,102,241,0.12)", "rgba(99,102,241,0.22)",
    "rgba(99,102,241,0.38)", "rgba(99,102,241,0.56)", "rgba(99,102,241,0.82)",
  ];

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-desc">Threat intelligence via 0G Compute</p>
        </div>
        <button className="btn btn-primary" onClick={runQuickAnalysis} disabled={analyzing}>
          {analyzing ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { label: "Exploits Blocked", value: stats.blocked, color: "var(--red)", meta: "+12% this week", up: true },
          { label: "Threats Analyzed", value: stats.detected.toLocaleString(), meta: "+8% this week", up: true },
          { label: "Protocols Guarded", value: stats.protocols, meta: "3 new this wave" },
          { label: "Uptime", value: `${stats.uptime}%`, color: "var(--green)", meta: "99.7% SLA" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={s.color ? { color: s.color } : undefined}>{s.value}</div>
            <div className={`stat-meta${s.up ? " up" : ""}`}>{s.meta}</div>
          </div>
        ))}
      </div>

      {/* Analysis result */}
      {lastResult && !lastResult.error && (
        <div className="panel" style={{ marginBottom: 10 }}>
          <div className="panel-header">
            <span className="panel-title">Analysis Result</span>
            <span className={`tag ${lastResult.classification === "SAFE" ? "active" : "critical"}`}>
              {lastResult.classification}
            </span>
          </div>
          <div className="panel-body padded">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 2 }}>Confidence</div>
                <div style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: 14 }}>
                  {(lastResult.confidence * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 2 }}>Threat Level</div>
                <div style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: 14 }}>
                  {lastResult.threatLevel}/10
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 2 }}>Source</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11 }}>{lastResult.source}</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{lastResult.reasoning}</p>
          </div>
        </div>
      )}

      {/* Charts row */}
      <div className="grid-2col" style={{ marginBottom: 10 }}>
        {/* Threat Timeline */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Threat Timeline (14d)</span>
            <span className="live-badge"><span className="dot" /> Live</span>
          </div>
          <div className="panel-body" style={{ padding: "12px 8px 4px 0" }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="gradThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS.indigo} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={CHART_COLORS.indigo} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS.red} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={CHART_COLORS.red} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#3f3f46" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#3f3f46" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="threats" name="Analyzed" stroke={CHART_COLORS.indigo} fill="url(#gradThreats)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="blocked" name="Blocked" stroke={CHART_COLORS.red} fill="url(#gradBlocked)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Classification + Severity */}
        <div className="grid-2eq">
          {/* Classification donut */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">By Type</span>
            </div>
            <div className="panel-body" style={{ padding: "8px 0" }}>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={classificationData} cx="50%" cy="50%"
                    innerRadius={45} outerRadius={70}
                    paddingAngle={2} dataKey="value"
                    stroke="none"
                  >
                    {classificationData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", padding: "0 14px 8px", justifyContent: "center" }}>
                {classificationData.map((d, i) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#a1a1aa" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: PIE_COLORS[i] }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Severity histogram */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">By Severity</span>
            </div>
            <div className="panel-body" style={{ padding: "12px 8px 4px 0" }}>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={severityData}>
                  <XAxis dataKey="level" tick={{ fontSize: 10, fill: "#3f3f46" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#3f3f46" }} axisLine={false} tickLine={false} width={25} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Count" radius={[3, 3, 0, 0]}>
                    {severityData.map((_, i) => (
                      <Cell key={i} fill={[
                        "rgba(99,102,241,0.4)",
                        "rgba(99,102,241,0.5)",
                        "rgba(234,179,8,0.5)",
                        "rgba(249,115,22,0.6)",
                        "rgba(239,68,68,0.7)",
                      ][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2col">
        {/* Threat Feed */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Threat Feed</span>
            <span style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "var(--mono)" }}>
              {threats.length} entries
            </span>
          </div>
          <div className="panel-body">
            {threats.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>No threats detected yet</span>
                <span style={{ fontSize: 11 }}>Run an analysis or simulation to see results here.</span>
              </div>
            ) : (
              threats.slice(0, 8).map((t) => (
                <div key={t.id} className="threat-row">
                  <span className={`severity-dot ${t.severity}`} />
                  <div className="threat-body">
                    <div className="threat-title">{t.type}</div>
                    <div className="threat-sub">{t.detail}</div>
                  </div>
                  <div className="threat-meta">
                    <span className={`tag ${t.status}`}>{t.status}</span>
                    <span className="threat-time">{t.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="stack">
          {/* Sentinels */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Active Sentinels</span>
              <span style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "var(--mono)" }}>
                {sentinels.filter((s) => s.status === "active").length} online
              </span>
            </div>
            <div className="panel-body">
              {sentinels.map((s) => {
                const tier = typeof s.tier === "number" ? TIER_LABELS[s.tier] : s.tier;
                const rep = typeof s.reputation === "bigint" ? Number(s.reputation) : s.reputation;
                const det = typeof s.totalDetections === "bigint" ? Number(s.totalDetections) : (s.totalDetections || s.detections || 0);
                const statusLabel = typeof s.status === "number" ? (s.status === 0 ? "active" : "paused") : s.status;

                return (
                  <div key={s.id} className="threat-row">
                    <div className="sentinel-icon" style={{ width: 28, height: 28 }}>
                      <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42"/>
                      </svg>
                    </div>
                    <div className="threat-body">
                      <div className="threat-title">{s.name}</div>
                      <div className="threat-sub">Rep {rep} · {det} det.</div>
                    </div>
                    <span className={`tag ${tier}`}>{tier}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Heatmap */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Threat Activity (7d)</span>
            </div>
            <div className="panel-body padded">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 3 }}>
                {heatmap.map((level, i) => (
                  <div key={i} style={{ aspectRatio: "1", borderRadius: 2, background: heatmapColors[level] }} />
                ))}
              </div>
              <div className="heatmap-scale">
                <span>Low</span>
                <div className="heatmap-scale-bar">
                  {heatmapColors.map((c, i) => <span key={i} style={{ background: c }} />)}
                </div>
                <span>Critical</span>
              </div>
            </div>
          </div>

          {/* 0G Stack */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">0G Stack</span>
              {onChainStats && (
                <span style={{ fontSize: 10, color: "var(--green)", fontFamily: "var(--mono)" }}>LIVE</span>
              )}
            </div>
            <div className="panel-body padded">
              {[
                { name: "0G Chain", detail: onChainStats ? `${onChainStats.totalSentinels} sentinels, ${onChainStats.totalAlerts} alerts` : "Galileo Testnet", ok: true },
                { name: "0G Compute", detail: "Router API", ok: true },
                { name: "0G Storage", detail: "Evidence DB", ok: true },
                { name: "Circuit Breaker", detail: onChainStats?.isPaused ? "PAUSED" : "Armed", ok: !onChainStats?.isPaused },
              ].map((item) => (
                <div key={item.name} className="integ-row">
                  <div>
                    <div className="integ-name">{item.name}</div>
                    <div className="integ-detail">{item.detail}</div>
                  </div>
                  <span className={`tag ${item.ok ? "active" : "critical"}`}>
                    {item.ok ? "connected" : "triggered"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
