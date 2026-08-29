"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function LandingPage() {
  const revealRefs = useRef([]);

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

  const addRef = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="landing-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          Hashly
        </div>
        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#how-it-works" className="landing-nav-link">How it works</a>
          <a href="#stack" className="landing-nav-link">Tech Stack</a>
          <Link href="/dashboard" className="btn-launch">Launch App</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">Built on 0G Network</div>
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
            View Source
          </a>
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
              AI models classify exploit patterns — reentrancy, flash loans,
              oracle manipulation — with sub-second latency via 0G Compute Router.
            </p>
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
              pauses the protocol automatically — no human in the loop.
            </p>
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
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" id="how-it-works">
        <div className="reveal" ref={addRef}>
          <div className="section-label">Process</div>
          <div className="section-title">From threat to resolution in seconds.</div>
          <div className="section-desc">
            A fully autonomous pipeline — no dashboards to watch, no alerts to triage.
          </div>
        </div>

        <div className="steps-list reveal" ref={addRef}>
          <div className="step-item">
            <div className="step-num">01</div>
            <div>
              <h4>Transaction data is intercepted</h4>
              <p>Sentinel agents monitor target smart contracts for unusual patterns — high gas, recursive calls, flash loan activity.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-num">02</div>
            <div>
              <h4>AI classifies the threat via 0G Compute</h4>
              <p>Transaction data is sent to the 0G Compute Router for decentralized AI inference. The model returns a classification with confidence score.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-num">03</div>
            <div>
              <h4>Evidence is stored on 0G Storage</h4>
              <p>Detection evidence and transaction traces are hashed and stored immutably on 0G&apos;s decentralized storage layer.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-num">04</div>
            <div>
              <h4>Circuit breaker triggers on-chain</h4>
              <p>If the threat level exceeds the threshold, the ProtocolGuard contract pauses the vulnerable protocol automatically.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-num">05</div>
            <div>
              <h4>Sentinel reputation updates</h4>
              <p>The detecting agent&apos;s on-chain reputation increases, advancing it through Scout → Guardian → Warden → Overlord tiers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section" id="stack">
        <div className="reveal" ref={addRef}>
          <div className="section-label">Built on 0G</div>
          <div className="section-title">Full-stack 0G integration.</div>
          <div className="section-desc">
            Every layer of the 0G modular stack is used for a specific purpose.
          </div>
        </div>

        <div className="tech-grid reveal" ref={addRef}>
          <div className="tech-card">
            <div className="tech-card-name">0G Chain</div>
            <div className="tech-card-desc">Smart contracts, circuit breakers, and agent NFTs on Galileo Testnet.</div>
          </div>
          <div className="tech-card">
            <div className="tech-card-name">0G Compute</div>
            <div className="tech-card-desc">AI inference via Router API for real-time exploit classification.</div>
          </div>
          <div className="tech-card">
            <div className="tech-card-name">0G Storage</div>
            <div className="tech-card-desc">Immutable exploit evidence and sentinel metadata storage.</div>
          </div>
          <div className="tech-card">
            <div className="tech-card-name">ERC-7857</div>
            <div className="tech-card-desc">Agentic ID standard for tokenized, transferable AI agents.</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section reveal" ref={addRef} style={{ textAlign: "center", paddingBottom: 100 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Ready to try it?</div>
        <p style={{ fontSize: 15, color: "var(--text-1)", marginBottom: 28 }}>
          Connect your wallet and explore the dashboard.
        </p>
        <Link href="/dashboard" className="btn-launch" style={{ padding: "12px 32px", fontSize: 14 }}>
          Launch App
        </Link>
      </section>

      <footer className="landing-footer">
        Hashly — Built for the 0G Bridge Buildathon by AKINDO
      </footer>
    </div>
  );
}
