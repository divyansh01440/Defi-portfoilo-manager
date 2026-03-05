'use client';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@300;400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.wp-root {
  background: #030810; color: #fff;
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh; padding-top: 68px;
}

/* BG */
.wp-bg {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}
.wp-bg::after {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,212,255,0.07), transparent 60%);
}

/* HERO */
.wp-hero {
  max-width: 860px; margin: 0 auto; padding: 80px 2rem 60px;
  text-align: center; position: relative; z-index: 1;
}
.wp-eyebrow {
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px;
  border-radius: 100px; border: 1px solid rgba(0,212,255,0.3);
  background: rgba(0,212,255,0.06); font-family: 'DM Mono', monospace;
  font-size: 0.72rem; letter-spacing: 2px; color: #00d4ff;
  text-transform: uppercase; margin-bottom: 2rem;
}
.wp-hero-title {
  font-family: 'Orbitron', monospace; font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.wp-hero-title span {
  background: linear-gradient(135deg, #00d4ff, #00ff88);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.wp-hero-meta {
  display: flex; align-items: center; justify-content: center; gap: 1.5rem;
  flex-wrap: wrap; margin-top: 2rem;
}
.wp-meta-item { font-family: 'DM Mono', monospace; font-size: 0.78rem; color: rgba(255,255,255,0.35); }
.wp-meta-sep { color: rgba(255,255,255,0.15); }

/* LAYOUT */
.wp-layout {
  max-width: 1100px; margin: 0 auto; padding: 0 2rem 80px;
  display: grid; grid-template-columns: 220px 1fr; gap: 3rem;
  position: relative; z-index: 1; align-items: start;
}

/* TOC */
.wp-toc {
  position: sticky; top: 90px;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px; padding: 20px;
}
.wp-toc-title { font-family: 'DM Mono', monospace; font-size: 0.68rem; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 14px; }
.toc-link {
  display: flex; align-items: center; gap: 8px; padding: 7px 10px;
  border-radius: 8px; font-size: 0.82rem; color: rgba(255,255,255,0.4);
  cursor: pointer; transition: all 0.2s; text-decoration: none; margin-bottom: 2px;
}
.toc-link:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.04); }
.toc-link.active { color: #00d4ff; background: rgba(0,212,255,0.08); }
.toc-num { font-family: 'DM Mono', monospace; font-size: 0.68rem; color: rgba(0,212,255,0.5); min-width: 16px; }

/* CONTENT */
.wp-content { display: flex; flex-direction: column; gap: 0; }

.wp-section {
  padding: 60px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.wp-section:last-child { border-bottom: none; }

.wp-sec-num {
  font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 2px;
  text-transform: uppercase; color: #00d4ff; margin-bottom: 10px;
}
.wp-sec-title {
  font-family: 'Orbitron', monospace; font-size: clamp(1.3rem, 2.5vw, 1.8rem);
  font-weight: 700; margin-bottom: 24px; color: #fff; line-height: 1.2;
}
.wp-p {
  font-size: 0.95rem; color: rgba(255,255,255,0.55); line-height: 1.85;
  margin-bottom: 1.2rem; font-weight: 300;
}
.wp-p:last-child { margin-bottom: 0; }

/* HIGHLIGHT BOX */
.wp-highlight {
  background: linear-gradient(135deg, rgba(0,212,255,0.05), rgba(0,255,136,0.03));
  border: 1px solid rgba(0,212,255,0.2); border-left: 3px solid #00d4ff;
  border-radius: 0 12px 12px 0; padding: 20px 24px; margin: 24px 0;
  font-size: 0.9rem; color: rgba(255,255,255,0.7); line-height: 1.75;
}

/* CARDS GRID */
.wp-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 24px 0; }
.wp-card {
  background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; padding: 22px; transition: all 0.3s;
}
.wp-card:hover { border-color: rgba(0,212,255,0.2); transform: translateY(-2px); }
.wp-card-icon { font-size: 1.4rem; margin-bottom: 10px; }
.wp-card-title { font-size: 0.9rem; font-weight: 600; color: #fff; margin-bottom: 6px; }
.wp-card-desc { font-size: 0.82rem; color: rgba(255,255,255,0.42); line-height: 1.65; font-weight: 300; }

/* CODE BLOCK */
.wp-code {
  background: #020609; border: 1px solid rgba(0,212,255,0.15);
  border-radius: 12px; overflow: hidden; margin: 20px 0;
}
.wp-code-bar {
  background: rgba(0,212,255,0.06); padding: 10px 16px;
  border-bottom: 1px solid rgba(0,212,255,0.1);
  display: flex; align-items: center; gap: 8px;
}
.wc-dot { width: 10px; height: 10px; border-radius: 50%; }
.wp-code-label { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: rgba(255,255,255,0.3); margin-left: auto; }
.wp-code pre {
  padding: 20px; font-family: 'DM Mono', monospace; font-size: 0.8rem;
  color: rgba(255,255,255,0.6); line-height: 1.75; overflow-x: auto;
  white-space: pre-wrap; word-break: break-word;
}
.kw { color: #00d4ff; }
.str { color: #00ff88; }
.num { color: #ffd166; }
.cmt { color: rgba(255,255,255,0.28); font-style: italic; }

/* TABLE */
.wp-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
.wp-table th {
  font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 1.5px;
  text-transform: uppercase; color: rgba(255,255,255,0.35); padding: 12px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08); text-align: left;
}
.wp-table td {
  font-size: 0.88rem; padding: 14px 16px; color: rgba(255,255,255,0.6);
  border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 300;
}
.wp-table tr:hover td { background: rgba(255,255,255,0.02); }
.wp-table td:first-child { color: rgba(255,255,255,0.85); font-weight: 500; }
.td-tag {
  display: inline-block; padding: 3px 10px; border-radius: 6px;
  font-family: 'DM Mono', monospace; font-size: 0.68rem;
  background: rgba(0,212,255,0.08); color: #00d4ff; border: 1px solid rgba(0,212,255,0.2);
}

/* ARCH DIAGRAM */
.arch-diagram {
  background: #020609; border: 1px solid rgba(0,212,255,0.15);
  border-radius: 14px; padding: 32px; margin: 24px 0;
  display: flex; align-items: center; justify-content: center; gap: 0; flex-wrap: wrap;
}
.arch-box {
  background: rgba(0,212,255,0.07); border: 1px solid rgba(0,212,255,0.25);
  border-radius: 10px; padding: 14px 18px; text-align: center; min-width: 110px;
}
.arch-box-title { font-family: 'Orbitron', monospace; font-size: 0.65rem; color: #00d4ff; font-weight: 700; letter-spacing: 1px; }
.arch-box-sub { font-family: 'DM Mono', monospace; font-size: 0.65rem; color: rgba(255,255,255,0.3); margin-top: 3px; }
.arch-arrow { color: rgba(0,212,255,0.4); font-size: 1.2rem; padding: 0 8px; }

/* PHASE GRID */
.phase-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 24px; }
.phase-card {
  background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; padding: 22px;
}
.phase-tag {
  font-family: 'DM Mono', monospace; font-size: 0.68rem; padding: 3px 10px;
  border-radius: 6px; border: 1px solid; display: inline-block; margin-bottom: 10px;
}
.phase-title { font-size: 0.95rem; font-weight: 600; color: #fff; margin-bottom: 6px; }
.phase-desc { font-size: 0.82rem; color: rgba(255,255,255,0.42); line-height: 1.65; font-weight: 300; }

/* RESPONSIVE */
@media (max-width: 900px) {
  .wp-layout { grid-template-columns: 1fr; }
  .wp-toc { position: static; display: none; }
  .wp-cards { grid-template-columns: 1fr; }
  .phase-grid { grid-template-columns: 1fr; }
  .arch-diagram { flex-direction: column; }
  .arch-arrow { transform: rotate(90deg); }
}
`;

const SECTIONS = ['Abstract', 'Problem', 'Architecture', 'AI Design', 'Security', 'Tech Stack', 'Roadmap', 'Conclusion'];

export default function Whitepaper() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="wp-root">
        <div className="wp-bg" />

        {/* HERO */}
        <div className="wp-hero">
          <div className="wp-eyebrow">📄 Technical Whitepaper · v1.0</div>
          <h1 className="wp-hero-title">
            <span>ChainMind</span><br />
            DeFi Portfolio Manager
          </h1>
          <div className="wp-hero-meta">
            <span className="wp-meta-item">Chainlink Hackathon 2026</span>
            <span className="wp-meta-sep">·</span>
            <span className="wp-meta-item">March 2026</span>
            <span className="wp-meta-sep">·</span>
            <span className="wp-meta-item">Base Sepolia</span>
            <span className="wp-meta-sep">·</span>
            <span className="wp-meta-item">MIT License</span>
          </div>
        </div>

        {/* LAYOUT */}
        <div className="wp-layout">

          {/* TOC */}
          <div className="wp-toc">
            <div className="wp-toc-title">Contents</div>
            {SECTIONS.map((s, i) => (
              <a key={i} className="toc-link" href={`#sec-${i}`}>
                <span className="toc-num">0{i + 1}</span>
                {s}
              </a>
            ))}
          </div>

          {/* CONTENT */}
          <div className="wp-content">

            {/* 1. ABSTRACT */}
            <div className="wp-section" id="sec-0">
              <div className="wp-sec-num">01 — Abstract</div>
              <h2 className="wp-sec-title">Overview</h2>
              <p className="wp-p">ChainMind is an autonomous DeFi portfolio management protocol that combines Chainlink's decentralized oracle infrastructure with Google Gemini AI to deliver institutional-grade portfolio rebalancing on the Base Layer 2 network.</p>
              <p className="wp-p">The protocol continuously monitors asset allocations against user-defined targets, detects drift, and executes rebalancing trades autonomously — without requiring human intervention. All decisions are logged on-chain for full transparency and auditability.</p>
              <div className="wp-highlight">
                <strong>Core thesis:</strong> Retail DeFi investors deserve the same systematic portfolio management tools that institutional quants have used for decades — delivered autonomously, trustlessly, and at near-zero cost through smart contract automation.
              </div>
            </div>

            {/* 2. PROBLEM */}
            <div className="wp-section" id="sec-1">
              <div className="wp-sec-num">02 — The Problem</div>
              <h2 className="wp-sec-title">What we're solving</h2>
              <p className="wp-p">Crypto markets operate 24 hours a day, 7 days a week — a pace that no human can consistently monitor. The result is predictable: portfolios drift from their intended allocations, compounding risk and eroding returns over time.</p>
              <div className="wp-cards">
                <div className="wp-card">
                  <div className="wp-card-icon">⏰</div>
                  <div className="wp-card-title">24/7 Market Exposure</div>
                  <div className="wp-card-desc">Markets never sleep. Manual management leads to missed rebalancing windows and extended periods of unintended risk exposure.</div>
                </div>
                <div className="wp-card">
                  <div className="wp-card-icon">😰</div>
                  <div className="wp-card-title">Emotional Decision-Making</div>
                  <div className="wp-card-desc">Fear and greed drive retail investors to deviate from optimal strategies at the worst possible moments.</div>
                </div>
                <div className="wp-card">
                  <div className="wp-card-icon">📉</div>
                  <div className="wp-card-title">Portfolio Drift</div>
                  <div className="wp-card-desc">Without regular rebalancing, winning assets become overweighted, silently increasing portfolio volatility and concentration risk.</div>
                </div>
                <div className="wp-card">
                  <div className="wp-card-icon">🏦</div>
                  <div className="wp-card-title">Institutional Advantage</div>
                  <div className="wp-card-desc">Hedge funds use algorithmic rebalancing as standard practice. Retail investors have historically had no equivalent access.</div>
                </div>
              </div>
            </div>

            {/* 3. ARCHITECTURE */}
            <div className="wp-section" id="sec-2">
              <div className="wp-sec-num">03 — System Architecture</div>
              <h2 className="wp-sec-title">How the system works</h2>
              <p className="wp-p">ChainMind is built as a four-layer stack: oracle data feeds → AI reasoning engine → smart contract execution → on-chain settlement. Each layer is independently verifiable and auditable.</p>

              <div className="arch-diagram">
                <div className="arch-box">
                  <div className="arch-box-title">Chainlink</div>
                  <div className="arch-box-sub">Price Feeds</div>
                </div>
                <div className="arch-arrow">→</div>
                <div className="arch-box">
                  <div className="arch-box-title">Gemini AI</div>
                  <div className="arch-box-sub">Reasoning</div>
                </div>
                <div className="arch-arrow">→</div>
                <div className="arch-box">
                  <div className="arch-box-title">CRE Engine</div>
                  <div className="arch-box-sub">Decision</div>
                </div>
                <div className="arch-arrow">→</div>
                <div className="arch-box">
                  <div className="arch-box-title">Base L2</div>
                  <div className="arch-box-sub">Execution</div>
                </div>
              </div>

              <p className="wp-p">The Chainlink Reactive Engine (CRE) acts as the coordination layer, listening for oracle price updates and triggering the AI analysis pipeline when drift thresholds are exceeded. This event-driven architecture ensures the system reacts to market conditions in near real-time.</p>
            </div>

            {/* 4. AI DESIGN */}
            <div className="wp-section" id="sec-3">
              <div className="wp-sec-num">04 — AI Reasoning Design</div>
              <h2 className="wp-sec-title">The Gemini integration</h2>
              <p className="wp-p">Rather than using rigid rule-based rebalancing, ChainMind employs Gemini Pro to reason about portfolio state in context. The AI receives a structured prompt containing current prices, target allocations, portfolio drift, and market conditions.</p>

              <div className="wp-code">
                <div className="wp-code-bar">
                  <span className="wc-dot" style={{ background: '#ff6b6b' }} />
                  <span className="wc-dot" style={{ background: '#ffd166' }} />
                  <span className="wc-dot" style={{ background: '#00ff88' }} />
                  <span className="wp-code-label">AI Prompt Structure</span>
                </div>
                <pre>{`<span class="cmt">// Portfolio context injected into Gemini</span>
<span class="kw">const</span> prompt = \`
  <span class="str">Current Portfolio State:</span>
  - ETH: <span class="num">$3240</span> | Target: <span class="num">50%</span> | Current: <span class="num">48.2%</span> | Drift: <span class="num">-1.8%</span>
  - BTC: <span class="num">$67420</span> | Target: <span class="num">30%</span> | Current: <span class="num">32.1%</span> | Drift: <span class="num">+2.1%</span>
  - LINK: <span class="num">$18.72</span> | Target: <span class="num">12%</span> | Current: <span class="num">11.4%</span> | Drift: <span class="num">-0.6%</span>

  <span class="str">Respond with JSON:</span>
  { action, confidence, reasoning, trades[] }
\``}</pre>
              </div>

              <p className="wp-p">The AI's response is parsed and validated. Trades are only executed when the confidence score exceeds a configurable threshold (default: 75%). This prevents low-confidence suggestions from triggering unnecessary gas expenditure.</p>
            </div>

            {/* 5. SECURITY */}
            <div className="wp-section" id="sec-4">
              <div className="wp-sec-num">05 — Security Model</div>
              <h2 className="wp-sec-title">Safety by design</h2>
              <p className="wp-p">Every autonomous system needs guardrails. ChainMind implements a multi-layer security model that prevents the AI from taking harmful actions regardless of market conditions.</p>

              <div className="wp-cards">
                <div className="wp-card">
                  <div className="wp-card-icon">🎯</div>
                  <div className="wp-card-title">Confidence Threshold</div>
                  <div className="wp-card-desc">Trades only execute when AI confidence ≥ 75%. Below this threshold, the system alerts the user and waits for manual confirmation.</div>
                </div>
                <div className="wp-card">
                  <div className="wp-card-icon">📏</div>
                  <div className="wp-card-title">Slippage Protection</div>
                  <div className="wp-card-desc">Maximum slippage per trade is hardcoded at 2%. Any execution that would exceed this is automatically cancelled.</div>
                </div>
                <div className="wp-card">
                  <div className="wp-card-icon">⏱️</div>
                  <div className="wp-card-title">Cooldown Period</div>
                  <div className="wp-card-desc">A mandatory 6-hour cooldown between rebalancing events prevents over-trading and excessive gas expenditure.</div>
                </div>
                <div className="wp-card">
                  <div className="wp-card-icon">🔑</div>
                  <div className="wp-card-title">Human Override</div>
                  <div className="wp-card-desc">The wallet owner can pause, modify, or cancel any operation at any time. Full custody is never surrendered.</div>
                </div>
              </div>
            </div>

            {/* 6. TECH STACK */}
            <div className="wp-section" id="sec-5">
              <div className="wp-sec-num">06 — Technology Stack</div>
              <h2 className="wp-sec-title">What it's built on</h2>

              <table className="wp-table">
                <thead>
                  <tr>
                    <th>Layer</th>
                    <th>Technology</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Oracle', 'Chainlink Data Streams', 'Tamper-proof, sub-second price feeds'],
                    ['Automation', 'Chainlink Reactive Engine', 'Event-driven smart contract triggers'],
                    ['AI', 'Google Gemini Pro', 'Portfolio analysis and trade reasoning'],
                    ['Execution', 'Base Sepolia (L2)', 'Smart contract deployment and settlement'],
                    ['Wallet', 'MetaMask + ethers.js', 'User authentication and tx signing'],
                    ['Frontend', 'Next.js 14 + React', 'Server-rendered UI with App Router'],
                    ['Language', 'Solidity + TypeScript', 'Contract and application logic'],
                  ].map(([l, t, p], i) => (
                    <tr key={i}>
                      <td><span className="td-tag">{l}</span></td>
                      <td>{t}</td>
                      <td>{p}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 7. ROADMAP */}
            <div className="wp-section" id="sec-6">
              <div className="wp-sec-num">07 — Roadmap</div>
              <h2 className="wp-sec-title">What's next</h2>
              <p className="wp-p">The hackathon submission represents v1 of ChainMind. The following phases outline our path to a production-grade, multi-chain portfolio management protocol.</p>

              <div className="phase-grid">
                {[
                  { phase: 'Phase 1', label: 'Q2 2026', color: '#00d4ff', title: 'Mainnet Launch', desc: 'Deploy to Base Mainnet. Full Chainlink integration. Production AI pipeline with Gemini Flash for cost efficiency.' },
                  { phase: 'Phase 2', label: 'Q3 2026', color: '#00ff88', title: 'Multi-Asset & Multi-Chain', desc: 'Support 20+ assets. Expand to Polygon, Arbitrum, and Optimism. Cross-chain rebalancing via CCIP.' },
                  { phase: 'Phase 3', label: 'Q4 2026', color: '#7c3aed', title: 'Social & Analytics', desc: 'Portfolio sharing, leaderboards, strategy templates. Advanced analytics dashboard with backtesting.' },
                  { phase: 'Phase 4', label: '2027', color: '#ffd166', title: 'Protocol & DAO', desc: 'Governance token launch. Strategy marketplace. Third-party AI model plugins. Institutional API.' },
                ].map((p, i) => (
                  <div className="phase-card" key={i}>
                    <span className="phase-tag" style={{ color: p.color, borderColor: p.color, background: `${p.color}15` }}>
                      {p.phase} · {p.label}
                    </span>
                    <div className="phase-title">{p.title}</div>
                    <div className="phase-desc">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. CONCLUSION */}
            <div className="wp-section" id="sec-7">
              <div className="wp-sec-num">08 — Conclusion</div>
              <h2 className="wp-sec-title">Why this matters</h2>
              <p className="wp-p">ChainMind demonstrates that the combination of Chainlink's trust-minimized oracle infrastructure and modern AI reasoning can deliver a new category of DeFi application: one that acts intelligently on behalf of users without requiring trust in any centralized entity.</p>
              <p className="wp-p">By using Chainlink for data integrity and Gemini for decision intelligence, we achieve a system where every input is verifiable, every decision is explainable, and every execution is auditable on-chain.</p>
              <div className="wp-highlight">
                <strong>The vision:</strong> A world where every DeFi participant — regardless of technical knowledge or time availability — has access to sophisticated portfolio management that was previously reserved for institutions with seven-figure technology budgets.
              </div>
              <p className="wp-p" style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
                Built for the <strong style={{ color: '#00d4ff' }}>Chainlink Hackathon 2026</strong> · 
                Source: <strong style={{ color: '#00d4ff' }}>github.com/chainmind</strong> · 
                License: MIT
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}