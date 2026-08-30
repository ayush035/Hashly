"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Sidebar({ activePage, setActivePage, threatCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img src="/logo.png" alt="Hashly" style={{ width: 28, height: 28, objectFit: "contain" }} />
          <span className="sidebar-brand-name">Hashly</span>
          <span className="sidebar-brand-tag">0G</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group-label">Monitor</div>

        <button
          className={`nav-link ${activePage === "dashboard" ? "active" : ""}`}
          onClick={() => setActivePage("dashboard")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Dashboard
        </button>

        <button
          className={`nav-link ${activePage === "sentinels" ? "active" : ""}`}
          onClick={() => setActivePage("sentinels")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          Sentinels
        </button>

        <button
          className={`nav-link ${activePage === "simulate" ? "active" : ""}`}
          onClick={() => setActivePage("simulate")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Simulate
          {threatCount > 0 && <span className="nav-badge">{threatCount}</span>}
        </button>

        <div className="nav-group-label" style={{ marginTop: 8 }}>Links</div>

        <a className="nav-link" href="https://chainscan-testnet.0g.ai" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          0G Explorer
        </a>

        <a className="nav-link" href="/" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Home
        </a>
      </nav>

      <div className="sidebar-footer">
        <ConnectButton.Custom>
          {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
            const connected = mounted && account && chain;
            return (
              <div style={{ opacity: mounted ? 1 : 0 }}>
                {connected ? (
                  <div>
                    <button className="wallet-btn connected" onClick={openAccountModal}>
                      <span className="status-dot" />
                      <span className="wallet-address">{account.displayName}</span>
                    </button>
                    <button
                      className="wallet-btn"
                      onClick={openChainModal}
                      style={{ marginTop: 6, fontSize: 10, justifyContent: "center", color: "var(--text-2)" }}
                    >
                      {chain.name}
                    </button>
                  </div>
                ) : (
                  <button className="wallet-btn" onClick={openConnectModal}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="5" width="22" height="16" rx="2"/>
                      <path d="M1 10h22"/>
                    </svg>
                    Connect Wallet
                  </button>
                )}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </aside>
  );
}
