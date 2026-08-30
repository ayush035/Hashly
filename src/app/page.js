"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const revealRefs = useRef([]);
  const [counters, setCounters] = useState({ contracts: 0, threats: 0, uptime: 0 });
  const statsRef = useRef(null);
  const hasAnimated = useRef(false);
  const [activeArch, setActiveArch] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Counter animation for stats
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  function animateCounters() {
    const targets = { contracts: 3, threats: 141, uptime: 99.2 };
    const duration = 2000;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCounters({
        contracts: Math.round(targets.contracts * ease),
        threats: Math.round(targets.threats * ease),
        uptime: +(targets.uptime * ease).toFixed(1),
      });
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const addRef = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  const archLayers = [
    {
      id: "chain",
      name: "0G Chain",
      desc: "Smart contracts deployed on Galileo Testnet. SentinelRegistry manages ERC-7857 agent NFTs, ProtocolGuard triggers circuit breakers, and VulnerableVault provides simulation targets.",
      color: "var(--accent)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      ),
    },
    {
      id: "compute",
      name: "0G Compute",
      desc: "AI inference routed through the 0G Compute Router API. Llama-4-Scout model classifies exploit types (reentrancy, flash loan, oracle manipulation) with confidence scoring in under 2 seconds.",
      color: "#8b5cf6",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      ),
    },
    {
      id: "storage",
      name: "0G Storage",
      desc: "Exploit evidence (transaction traces, AI analysis results, threat metadata) is hashed and permanently stored on 0G decentralized storage for tamper-proof forensic records.",
      color: "var(--green)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
      ),
    },
    {
      id: "erc7857",
      name: "ERC-7857",
      desc: "Agentic ID standard for tokenized AI agents. Each sentinel gains on-chain reputation through successful detections and advances through Scout, Guardian, Warden, and Overlord tiers.",
      color: "var(--orange)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      ),
    },
  ];

  return (
    <div className="landing">
      {/* Animated background orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <img src="/logo.png" alt="Hashly" style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover" }} />
          Hashly
        </div>
        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#how-it-works" className="landing-nav-link">How it works</a>
          <a href="#architecture" className="landing-nav-link">Architecture</a>
          <a href="#stack" className="landing-nav-link">Tech Stack</a>
          <Link href="/dashboard" className="btn-launch">Launch App</Link>
        </div>
      </nav>

      {/* Hero section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            Built on 0G Network · Verifiable AI Security
          </div>
          <h1>
            DeFi security that<br />
            <span className="gradient-text">thinks for itself.</span>
          </h1>
          <p className="hero-sub">
            Autonomous AI agents that detect and neutralize smart contract exploits
            before damage occurs. Powered by verifiable compute on 0G.
          </p>
          <div className="hero-cta">
            <Link href="/dashboard" className="btn-launch">Launch App</Link>
            <a href="https://github.com/ayush035/Hashly" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              View Source
            </a>
          </div>

          {/* Minimalist Live Security Console (Replaces generic AI image) */}
          <div className="hero-console">
            <div className="console-header">
              <div className="console-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="console-title">HASHLY // AUTONOMOUS_SENTINEL_NODE</div>
              <div className="console-badge">
                <span className="live-dot" />
                0G GALILEO · 16602
              </div>
            </div>

            <div className="console-grid">
              <div className="c-item">
                <div className="c-label">INFERENCE ENGINE</div>
                <div className="c-val text-green">0G Compute Router</div>
                <div className="c-sub">Llama-4-Scout · &lt;2s</div>
              </div>
              <div className="c-item">
                <div className="c-label">CIRCUIT BREAKER</div>
                <div className="c-val text-accent">ProtocolGuard</div>
                <div className="c-sub">Auto-Pause Threat ≥ 7</div>
              </div>
              <div className="c-item">
                <div className="c-label">IMMUTABLE LOGS</div>
                <div className="c-val text-indigo">0G Storage Flow</div>
                <div className="c-sub">Merkle Proof Anchors</div>
              </div>
              <div className="c-item">
                <div className="c-label">AGENTIC IDS</div>
                <div className="c-val text-cyan">ERC-7857</div>
                <div className="c-sub">On-Chain Reputation</div>
              </div>
            </div>

            <div className="console-stream">
              <div className="stream-line">
                <span className="s-time">16:42:01</span>
                <span className="s-tag tag-sys">SYS</span>
                <span className="s-text">Sentinel telemetry initialized on 0G Galileo Testnet</span>
              </div>
              <div className="stream-line">
                <span className="s-time">16:42:03</span>
                <span className="s-tag tag-ai">0G-AI</span>
                <span className="s-text">Verifiable exploit classification active · 4 vectors</span>
              </div>
              <div className="stream-line">
                <span className="s-time">16:42:05</span>
                <span className="s-tag tag-guard">GUARD</span>
                <span className="s-text">ProtocolGuard armed: Target 0x6771...7908C5 protected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar reveal" ref={(el) => { addRef(el); statsRef.current = el; }}>
        <div className="stat-item">
          <div className="stat-value">{counters.contracts}</div>
          <div className="stat-label">Contracts Deployed</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-value">{counters.threats}+</div>
          <div className="stat-label">Threats Analyzed</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-value">{counters.uptime}%</div>
          <div className="stat-label">Detection Accuracy</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-value">&lt;2s</div>
          <div className="stat-label">Response Time</div>
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features" ref={addRef}>
        <div className="reveal" ref={addRef}>
          <div className="section-label">Capabilities</div>
          <div className="section-title">Security, autonomous and verifiable.</div>
          <div className="section-desc">
            Every detection is AI-driven, every action is on-chain, and every agent
            is a transferable asset.
          </div>
        </div>

        <div className="features-grid reveal" ref={addRef}>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: "var(--red-dim)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <h3>Real-time Detection</h3>
            <p>
              AI models classify exploit patterns like reentrancy, flash loans,
              and oracle manipulation with sub-second latency via 0G Compute Router.
            </p>
            <div className="feature-tag">0G Compute</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: "var(--accent-dim)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h3>Automated Circuit Breaker</h3>
            <p>
              When a critical threat is detected, the on-chain circuit breaker
              pauses the protocol automatically. No human in the loop.
            </p>
            <div className="feature-tag">0G Chain</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: "var(--green-dim)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/>
              </svg>
            </div>
            <h3>Evolving Agentic IDs</h3>
            <p>
              Each sentinel is an ERC-7857 token that gains reputation through
              successful detections. Trade, transfer, or compose agents on-chain.
            </p>
            <div className="feature-tag">ERC-7857</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: "rgba(99,102,241,0.12)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <h3>Immutable Evidence</h3>
            <p>
              All exploit evidence and detection traces are hashed and stored
              permanently on 0G Storage for tamper-proof forensic records.
            </p>
            <div className="feature-tag">0G Storage</div>
          </div>
        </div>
      </section>

      {/* How it works - Vertical pipeline */}
      <section className="section" id="how-it-works">
        <div className="reveal" ref={addRef}>
          <div className="section-label">Process</div>
          <div className="section-title">From threat to resolution in seconds.</div>
          <div className="section-desc">
            A fully autonomous pipeline. No dashboards to watch, no alerts to triage.
          </div>
        </div>

        <div className="pipeline-vertical reveal" ref={addRef}>
          <div className="pv-step">
            <div className="pv-marker">
              <div className="pv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div className="pv-line" />
            </div>
            <div className="pv-content">
              <div className="pv-num">01</div>
              <h4>Transaction Intercepted</h4>
              <p>Sentinel agents monitor target contracts for unusual patterns including high gas usage, recursive calls, and flash loan activity.</p>
            </div>
          </div>

          <div className="pv-step">
            <div className="pv-marker">
              <div className="pv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div className="pv-line" />
            </div>
            <div className="pv-content">
              <div className="pv-num">02</div>
              <h4>AI Classification</h4>
              <p>Transaction data is sent to the 0G Compute Router for decentralized AI inference using the Llama-4-Scout model.</p>
            </div>
          </div>

          <div className="pv-step">
            <div className="pv-marker">
              <div className="pv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
              </div>
              <div className="pv-line" />
            </div>
            <div className="pv-content">
              <div className="pv-num">03</div>
              <h4>Evidence Stored</h4>
              <p>Detection evidence and transaction traces are hashed and stored immutably on 0G&apos;s decentralized storage layer.</p>
            </div>
          </div>

          <div className="pv-step">
            <div className="pv-marker">
              <div className="pv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div className="pv-line" />
            </div>
            <div className="pv-content">
              <div className="pv-num">04</div>
              <h4>Circuit Breaker Triggered</h4>
              <p>If threat level exceeds the threshold, the ProtocolGuard contract pauses the vulnerable protocol automatically.</p>
            </div>
          </div>

          <div className="pv-step">
            <div className="pv-marker">
              <div className="pv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
            </div>
            <div className="pv-content">
              <div className="pv-num">05</div>
              <h4>Reputation Update</h4>
              <p>The detecting agent&apos;s on-chain reputation increases, advancing through Scout, Guardian, Warden, and Overlord tiers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture - Interactive */}
      <section className="section" id="architecture">
        <div className="reveal" ref={addRef}>
          <div className="section-label">Architecture</div>
          <div className="section-title">Full-stack 0G integration.</div>
          <div className="section-desc">
            Every layer of the 0G modular stack is used for a specific purpose in the Hashly pipeline. Click a layer to learn more.
          </div>
        </div>
        <div className="arch-interactive reveal" ref={addRef}>
          <div className="arch-layers">
            {archLayers.map((layer) => (
              <button
                key={layer.id}
                className={`arch-layer ${activeArch === layer.id ? "active" : ""}`}
                onClick={() => setActiveArch(activeArch === layer.id ? null : layer.id)}
                style={{ "--layer-color": layer.color }}
              >
                <div className="arch-layer-icon">{layer.icon}</div>
                <div className="arch-layer-name">{layer.name}</div>
                <svg className="arch-layer-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            ))}
          </div>
          <div className="arch-detail-panel">
            {activeArch ? (
              <div className="arch-detail-content" key={activeArch}>
                <div className="arch-detail-icon" style={{ color: archLayers.find(l => l.id === activeArch)?.color }}>
                  {archLayers.find(l => l.id === activeArch)?.icon}
                </div>
                <h4>{archLayers.find(l => l.id === activeArch)?.name}</h4>
                <p>{archLayers.find(l => l.id === activeArch)?.desc}</p>
              </div>
            ) : (
              <div className="arch-detail-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5" width="32" height="32"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <p>Select a layer to see how it fits into the Hashly pipeline</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Deployed Contracts */}
      <section className="section">
        <div className="reveal" ref={addRef}>
          <div className="section-label">On-Chain</div>
          <div className="section-title">Deployed on 0G Galileo Testnet.</div>
          <div className="section-desc">
            Three verified smart contracts powering the security pipeline.
          </div>
        </div>
        <div className="contracts-grid reveal" ref={addRef}>
          <a href="https://chainscan-galileo.0g.ai/address/0x01F9d2D5A4eA2BA7139D599b4f6B6D06cCB34bcE" target="_blank" rel="noopener noreferrer" className="contract-card">
            <div className="contract-name">SentinelRegistry</div>
            <div className="contract-desc">ERC-7857 Agentic ID management. Mint, transfer, and compose AI sentinel agents as on-chain NFTs.</div>
            <code className="contract-addr">0x01F9...4bcE</code>
          </a>
          <a href="https://chainscan-galileo.0g.ai/address/0x6224d82ab9bE92d4eCF116D8cafC13d078B83aFC" target="_blank" rel="noopener noreferrer" className="contract-card">
            <div className="contract-name">ProtocolGuard</div>
            <div className="contract-desc">Circuit breaker controller. Monitors threat levels and auto-pauses vulnerable protocols on detection.</div>
            <code className="contract-addr">0x6224...3aFC</code>
          </a>
          <a href="https://chainscan-galileo.0g.ai/address/0x67717afbCa0c2A4E060B2Ef0621bF33ef07908C5" target="_blank" rel="noopener noreferrer" className="contract-card">
            <div className="contract-name">VulnerableVault</div>
            <div className="contract-desc">Intentionally vulnerable demo contract used to simulate exploit detection and circuit breaker response.</div>
            <code className="contract-addr">0x6771...8C5</code>
          </a>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section" id="stack">
        <div className="reveal" ref={addRef}>
          <div className="section-label">Built on 0G</div>
          <div className="section-title">Every layer of 0G, purpose-built.</div>
          <div className="section-desc">
            Hashly uses the full 0G modular stack (compute, storage, and chain) for verifiable AI-powered security.
          </div>
        </div>

        <div className="tech-grid reveal" ref={addRef}>
          <div className="tech-card">
            <div className="tech-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <div className="tech-card-name">0G Chain</div>
            <div className="tech-card-desc">Smart contracts, circuit breakers, and agent NFTs deployed on Galileo Testnet (Chain ID: 16602).</div>
          </div>
          <div className="tech-card">
            <div className="tech-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div className="tech-card-name">0G Compute</div>
            <div className="tech-card-desc">AI inference via Router API. Llama-4-Scout model classifies exploits in real-time with confidence scoring.</div>
          </div>
          <div className="tech-card">
            <div className="tech-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <div className="tech-card-name">0G Storage</div>
            <div className="tech-card-desc">Immutable exploit evidence storage. Detection traces hashed and stored via 0G Storage SDK.</div>
          </div>
          <div className="tech-card">
            <div className="tech-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div className="tech-card-name">ERC-7857</div>
            <div className="tech-card-desc">Agentic ID standard. Tokenized AI agents with on-chain reputation, tier progression, and composability.</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section reveal" ref={addRef}>
        <div className="cta-content">
          <div className="section-title" style={{ marginBottom: 12 }}>Ready to try it?</div>
          <p style={{ fontSize: 15, color: "var(--text-1)", marginBottom: 28, maxWidth: 440, margin: "0 auto 28px" }}>
            Connect your wallet, run an exploit simulation, and watch the circuit breaker trigger in real-time.
          </p>
          <Link href="/dashboard" className="btn-launch" style={{ padding: "14px 36px", fontSize: 14 }}>
            Launch App
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="landing-logo" style={{ marginBottom: 8 }}>
              <div className="landing-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              Hashly
            </div>
            <p className="footer-desc">Autonomous AI security for DeFi protocols. Built on 0G.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <div className="footer-col-title">Product</div>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/dashboard">Sentinels</Link>
              <Link href="/dashboard">Simulate</Link>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Resources</div>
              <a href="https://github.com/ayush035/Hashly" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://docs.0g.ai" target="_blank" rel="noopener noreferrer">0G Docs</a>
              <a href="https://chainscan-galileo.0g.ai" target="_blank" rel="noopener noreferrer">Explorer</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          Hashly | Built for the 0G x AKINDO AI DeFi Buildathon
        </div>
      </footer>
    </div>
  );
}
