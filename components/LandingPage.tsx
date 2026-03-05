'use client'

import { useEffect, useRef, useState } from 'react'
import { useWallet } from '@/components/WalletContext'

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, prefix = '', suffix = '', duration = 2000 }: {
  to: number; prefix?: string; suffix?: string; duration?: number
}) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const start = Date.now()
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1)
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * to))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to, duration])
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap');
*{box-sizing:border-box}

.lp-root{background:#030810;color:#fff;font-family:'DM Sans',sans-serif;min-height:100vh;padding-top:64px;overflow-x:hidden}

/* Same grid bg as whitepaper/dashboard */
.lp-bg{position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);
  background-size:48px 48px}
.lp-bg::after{content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(0,212,255,0.07),transparent 60%)}

.lp-container{max-width:1100px;margin:0 auto;padding:0 20px;position:relative;z-index:1}

/* ── HERO ── */
.lp-hero{padding:80px 20px 60px;text-align:center;position:relative;z-index:1;max-width:860px;margin:0 auto}
.lp-eyebrow{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:100px;
  border:1px solid rgba(0,212,255,0.3);background:rgba(0,212,255,0.06);
  font-family:'DM Mono',monospace;font-size:0.7rem;letter-spacing:2px;color:#00d4ff;
  text-transform:uppercase;margin-bottom:1.8rem}
.lp-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:#00ff88;box-shadow:0 0 8px #00ff88;animation:lp-pulse 2s infinite}
@keyframes lp-pulse{0%,100%{opacity:1}50%{opacity:0.3}}
.lp-hero-title{font-family:'Orbitron',monospace;font-size:clamp(2rem,6vw,4rem);font-weight:900;
  line-height:1.08;margin-bottom:1.4rem;
  background:linear-gradient(135deg,#fff 0%,rgba(255,255,255,0.75) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent}
.lp-hero-title span{background:linear-gradient(135deg,#00d4ff,#00ff88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.lp-hero-sub{font-size:clamp(0.95rem,2vw,1.1rem);color:rgba(255,255,255,0.5);
  max-width:540px;margin:0 auto 2.4rem;line-height:1.75;font-weight:300}
.lp-hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.lp-btn-primary{padding:13px 28px;border-radius:10px;border:none;
  background:linear-gradient(135deg,#00d4ff,#00ff88);color:#030810;
  font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.95rem;cursor:pointer;
  transition:all 0.3s;box-shadow:0 0 24px rgba(0,212,255,0.3)}
.lp-btn-primary:hover{box-shadow:0 0 40px rgba(0,212,255,0.5);transform:translateY(-2px)}
.lp-btn-primary:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none}
.lp-btn-secondary{padding:13px 28px;border-radius:10px;
  border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);
  color:rgba(255,255,255,0.65);font-family:'DM Sans',sans-serif;font-weight:600;
  font-size:0.95rem;cursor:pointer;transition:all 0.25s}
.lp-btn-secondary:hover{border-color:rgba(0,212,255,0.3);color:#fff;background:rgba(0,212,255,0.06)}

/* ── DIVIDER ── */
.lp-divider{border:none;border-top:1px solid rgba(255,255,255,0.06);margin:0}

/* ── STATS BAR ── */
.lp-stats{padding:48px 20px;background:rgba(255,255,255,0.015);border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06)}
.lp-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;max-width:1100px;margin:0 auto}
.lp-stat-item{text-align:center}
.lp-stat-val{font-family:'Orbitron',monospace;font-size:clamp(1.6rem,3vw,2.2rem);font-weight:700;
  background:linear-gradient(135deg,#00d4ff,#00ff88);-webkit-background-clip:text;-webkit-text-fill-color:transparent;
  margin-bottom:6px;line-height:1}
.lp-stat-label{font-family:'DM Mono',monospace;font-size:0.68rem;letter-spacing:2px;
  text-transform:uppercase;color:rgba(255,255,255,0.35)}

/* ── SECTION COMMON ── */
.lp-section{padding:72px 20px}
.lp-sec-eyebrow{font-family:'DM Mono',monospace;font-size:0.68rem;letter-spacing:2.5px;
  text-transform:uppercase;color:#00d4ff;margin-bottom:10px}
.lp-sec-title{font-family:'Orbitron',monospace;font-size:clamp(1.3rem,3vw,2rem);font-weight:700;
  color:#fff;margin-bottom:14px;line-height:1.2}
.lp-sec-sub{font-size:0.92rem;color:rgba(255,255,255,0.45);line-height:1.75;
  max-width:540px;font-weight:300;margin-bottom:0}

/* ── FEATURE CARDS ── */
.lp-feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:36px}
.lp-feat-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);
  border-radius:14px;padding:22px 20px;transition:all 0.3s}
.lp-feat-card:hover{border-color:rgba(0,212,255,0.2);transform:translateY(-3px);background:rgba(0,212,255,0.03)}
.lp-feat-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;
  font-size:18px;margin-bottom:14px;border:1px solid rgba(255,255,255,0.08)}
.lp-feat-title{font-size:0.9rem;font-weight:600;color:#fff;margin-bottom:6px}
.lp-feat-desc{font-size:0.8rem;color:rgba(255,255,255,0.42);line-height:1.65;font-weight:300}

/* ── HOW IT WORKS ── */
.lp-how-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;max-width:1100px;margin:0 auto}
.lp-steps{display:flex;flex-direction:column;gap:24px;margin-top:28px}
.lp-step{display:flex;gap:16px}
.lp-step-num{width:42px;height:42px;border-radius:10px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-family:'DM Mono',monospace;font-weight:700;font-size:0.9rem}
.lp-step-title{font-size:0.9rem;font-weight:600;color:#fff;margin-bottom:4px}
.lp-step-desc{font-size:0.8rem;color:rgba(255,255,255,0.42);line-height:1.65;font-weight:300}

/* Terminal — same as dashboard */
.lp-terminal{background:#020609;border:1px solid rgba(0,212,255,0.15);border-radius:14px;overflow:hidden;font-family:'DM Mono',monospace}
.lp-term-bar{background:rgba(0,212,255,0.06);padding:10px 16px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(0,212,255,0.12)}
.lp-term-dot{width:10px;height:10px;border-radius:50%}
.lp-term-title{font-size:0.68rem;color:rgba(255,255,255,0.4);letter-spacing:1.5px;text-transform:uppercase;margin-left:auto}
.lp-term-body{padding:16px 20px}
.lp-term-line{font-size:0.76rem;line-height:2;animation:lp-fadein 0.4s ease both}
@keyframes lp-fadein{from{opacity:0}to{opacity:1}}
.lp-term-cursor{display:inline-block;width:7px;height:13px;background:#00d4ff;animation:lp-cur 1s infinite;vertical-align:middle}
@keyframes lp-cur{0%,49%{opacity:1}50%,100%{opacity:0}}

/* ── NUMBERS ── */
.lp-numbers-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:36px}
.lp-num-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);
  border-radius:14px;padding:28px 22px;text-align:center;transition:all 0.3s}
.lp-num-card:hover{transform:translateY(-2px)}
.lp-num-val{font-family:'Orbitron',monospace;font-weight:700;font-size:clamp(2rem,4vw,3rem);line-height:1;margin-bottom:8px}
.lp-num-label{font-size:0.88rem;font-weight:600;color:#fff;margin-bottom:4px}
.lp-num-sub{font-size:0.76rem;color:rgba(255,255,255,0.38);font-family:'DM Mono',monospace}

/* ── CTA ── */
.lp-cta-wrap{max-width:680px;margin:0 auto;text-align:center}
.lp-cta-box{background:rgba(255,255,255,0.02);border:1px solid rgba(0,212,255,0.15);
  border-radius:18px;padding:52px 32px;position:relative;overflow:hidden}
.lp-cta-box::before{content:'';position:absolute;top:-60%;left:50%;transform:translateX(-50%);
  width:500px;height:400px;border-radius:50%;
  background:radial-gradient(circle,rgba(0,212,255,0.08) 0%,transparent 70%);pointer-events:none}
.lp-cta-title{font-family:'Orbitron',monospace;font-size:clamp(1.4rem,3vw,2rem);font-weight:700;color:#fff;margin-bottom:12px;line-height:1.2}
.lp-cta-sub{font-size:0.9rem;color:rgba(255,255,255,0.45);margin-bottom:28px;line-height:1.7;font-weight:300}

/* ── FOOTER ── */
.lp-footer{border-top:1px solid rgba(255,255,255,0.06);padding:44px 20px 28px;background:rgba(255,255,255,0.01)}
.lp-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:32px;max-width:1100px;margin:0 auto 32px}
.lp-footer-logo{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.lp-footer-logo-icon{width:30px;height:30px;border-radius:8px;
  background:linear-gradient(135deg,#00d4ff,#00ff88);display:flex;align-items:center;justify-content:center;font-size:14px}
.lp-footer-logo-text{font-family:'Orbitron',monospace;font-size:0.9rem;font-weight:700;color:#fff}
.lp-footer-desc{font-size:0.8rem;color:rgba(255,255,255,0.35);line-height:1.7;font-weight:300;max-width:260px}
.lp-footer-col-title{font-family:'DM Mono',monospace;font-size:0.65rem;letter-spacing:2px;
  text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:14px}
.lp-footer-link{display:block;font-size:0.82rem;color:rgba(255,255,255,0.4);
  padding:3px 0;cursor:pointer;background:none;border:none;text-align:left;
  transition:color 0.2s;font-family:'DM Sans',sans-serif}
.lp-footer-link:hover{color:#00d4ff}
.lp-footer-tech{font-family:'DM Mono',monospace;font-size:0.7rem;color:rgba(255,255,255,0.3);padding:3px 0}
.lp-footer-bottom{max-width:1100px;margin:0 auto;padding-top:20px;border-top:1px solid rgba(255,255,255,0.05);
  display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
.lp-footer-copy{font-family:'DM Mono',monospace;font-size:0.68rem;color:rgba(255,255,255,0.2)}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .lp-stats-grid{grid-template-columns:repeat(2,1fr)!important}
  .lp-feat-grid{grid-template-columns:1fr 1fr!important}
  .lp-how-grid{grid-template-columns:1fr!important;gap:32px!important}
  .lp-numbers-grid{grid-template-columns:1fr!important}
  .lp-footer-grid{grid-template-columns:1fr!important;gap:24px!important}
}
@media(max-width:580px){
  .lp-hero{padding:56px 16px 40px}
  .lp-section{padding:48px 16px}
  .lp-feat-grid{grid-template-columns:1fr!important}
  .lp-stats-grid{grid-template-columns:repeat(2,1fr)!important}
  .lp-numbers-grid{grid-template-columns:1fr!important}
  .lp-cta-box{padding:36px 20px}
  .lp-footer{padding:36px 16px 24px}
}
`

interface LandingPageProps {
  onNavigate: (page: 'home' | 'dashboard' | 'whitepaper') => void
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const { address, connectWallet, isConnecting } = useWallet()

  return (
    <>
      <style suppressHydrationWarning>{STYLES}</style>
      <div className="lp-root">
        <div className="lp-bg" />

        {/* ── HERO ── */}
        <div className="lp-hero">
          <div className="lp-eyebrow">
            <span className="lp-eyebrow-dot" />
            Chainlink Convergence Hackathon 2026 · #cre-ai
          </div>
          <h1 className="lp-hero-title">
            Your Portfolio,<br />
            <span>Autonomously</span><br />
            Managed.
          </h1>
          <p className="lp-hero-sub">
            AutoPortfolio uses Chainlink Data Streams, CRE Workflows, and Gemini AI
            to continuously rebalance your DeFi portfolio — 24/7, on-chain, no spreadsheets required.
          </p>
          <div className="lp-hero-btns">
            {address ? (
              <button className="lp-btn-primary" onClick={() => onNavigate('dashboard')}>
                Open Dashboard →
              </button>
            ) : (
              <button className="lp-btn-primary" onClick={connectWallet} disabled={isConnecting}>
                {isConnecting ? 'Connecting...' : '🦊 Connect Wallet to Start'}
              </button>
            )}
            <button className="lp-btn-secondary" onClick={() => onNavigate('whitepaper')}>
              Read Whitepaper
            </button>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="lp-stats">
          <div className="lp-stats-grid">
            {[
              { val: 10000, prefix: '$', suffix: '',  label: 'Managed Portfolio' },
              { val: 3,     prefix: '',  suffix: '+', label: 'Assets Tracked'    },
              { val: 82,    prefix: '',  suffix: '%', label: 'AI Confidence'      },
              { val: 30,    prefix: '',  suffix: 's', label: 'Price Refresh'      },
            ].map((s, i) => (
              <div className="lp-stat-item" key={i}>
                <div className="lp-stat-val">
                  <Counter to={s.val} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="lp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <div className="lp-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="lp-container">
            <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
              <div className="lp-sec-eyebrow">Features</div>
              <h2 className="lp-sec-title">Everything a trading desk does,<br />automated for you</h2>
              <p className="lp-sec-sub">Institutional-grade portfolio management powered by decentralized infrastructure and AI reasoning.</p>
            </div>
            <div className="lp-feat-grid">
              {[
                { icon: '⛓️', title: 'Chainlink Data Streams', color: '#00d4ff', desc: 'Tamper-proof, real-time prices verified on-chain. No stale feeds, no manipulation risk — every decision uses cryptographically guaranteed data.' },
                { icon: '⚡', title: 'CRE Workflow Engine',    color: '#00d4ff', desc: 'Event-driven automation that triggers rebalancing only when drift thresholds are crossed. No over-trading, no noise.' },
                { icon: '🧠', title: 'Gemini AI Reasoning',   color: '#00ff88', desc: 'Gemini weighs momentum, sentiment, and risk to make nuanced portfolio decisions — not just rigid rules.' },
                { icon: '🦊', title: 'MetaMask Integration',   color: '#ffd166', desc: 'Connect in one click. All operations execute with your wallet signature on Base Sepolia. Your keys, always.' },
                { icon: '🛡️', title: 'Multi-Layer Security',   color: '#ff6b6b', desc: 'Confidence thresholds, slippage guards, cooldown periods, and human override — four independent safety layers.' },
                { icon: '📊', title: 'Live Analytics',         color: '#7c3aed', desc: 'Real-time allocation charts, drift tracking, and execution logs with full on-chain auditability.' },
              ].map((f, i) => (
                <div className="lp-feat-card" key={i}>
                  <div className="lp-feat-icon" style={{ background: `${f.color}14`, borderColor: `${f.color}22` }}>
                    {f.icon}
                  </div>
                  <div className="lp-feat-title">{f.title}</div>
                  <div className="lp-feat-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div className="lp-section" style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="lp-how-grid">
            <div>
              <div className="lp-sec-eyebrow">How It Works</div>
              <h2 className="lp-sec-title">Four-stage pipeline.<br />Always running.</h2>
              <p className="lp-sec-sub">From price feed to on-chain execution — every step is automated, verified, and logged.</p>
              <div className="lp-steps">
                {[
                  { n: '01', title: 'Observe',  color: '#00d4ff', border: 'rgba(0,212,255,0.25)', bg: 'rgba(0,212,255,0.08)', desc: 'Chainlink Data Streams deliver live ETH, BTC, and USDC prices — cryptographically signed and verified on-chain.' },
                  { n: '02', title: 'Trigger',  color: '#00d4ff', border: 'rgba(0,212,255,0.2)',  bg: 'rgba(0,212,255,0.06)', desc: 'CRE Workflow Engine checks if any asset has drifted more than 5% from its target allocation and fires the pipeline.' },
                  { n: '03', title: 'Reason',   color: '#00ff88', border: 'rgba(0,255,136,0.25)', bg: 'rgba(0,255,136,0.08)', desc: 'Gemini AI receives full portfolio context and returns a structured JSON decision with confidence score and reasoning.' },
                  { n: '04', title: 'Execute',  color: '#ffd166', border: 'rgba(255,209,102,0.25)',bg: 'rgba(255,209,102,0.08)',desc: 'Approved swaps execute on Base Sepolia via Uniswap V3. Every transaction is recorded on-chain permanently.' },
                ].map(s => (
                  <div className="lp-step" key={s.n}>
                    <div className="lp-step-num" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                      {s.n}
                    </div>
                    <div style={{ paddingTop: 4 }}>
                      <div className="lp-step-title">{s.title}</div>
                      <div className="lp-step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal */}
            <div className="lp-terminal">
              <div className="lp-term-bar">
                <span className="lp-term-dot" style={{ background: '#ff6b6b' }} />
                <span className="lp-term-dot" style={{ background: '#ffd166' }} />
                <span className="lp-term-dot" style={{ background: '#00ff88' }} />
                <span className="lp-term-title">AutoPortfolio CRE — Base Sepolia</span>
              </div>
              <div className="lp-term-body">
                {[
                  { color: 'rgba(255,255,255,0.25)', text: '[09:14:20] CRE Workflow triggered — drift check' },
                  { color: '#00d4ff',                text: '[09:14:21] Chainlink stream: ETH $2,847.50 ✓' },
                  { color: '#00d4ff',                text: '[09:14:21] ETH drift: +5.1% (threshold: 5%) ⚡' },
                  { color: '#00ff88',                text: '[09:14:22] Gemini AI reasoning...' },
                  { color: '#00ff88',                text: '[09:14:23] Decision: SELL ETH → BUY USDC (84%)' },
                  { color: '#ffd166',                text: '[09:14:24] Slippage check: 0.12% < 0.5% ✓' },
                  { color: '#ffd166',                text: '[09:14:25] Cooldown check: 18h > 4h ✓' },
                  { color: '#00ff88',                text: '[09:14:26] TX confirmed: 0x3f8a...c91d ✓' },
                ].map((l, i) => (
                  <div key={i} className="lp-term-line" style={{ color: l.color, animationDelay: `${i * 0.12}s` }}>
                    {l.text}
                  </div>
                ))}
                <div className="lp-term-line"><span className="lp-term-cursor" /></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── NUMBERS ── */}
        <div className="lp-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="lp-container">
            <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
              <div className="lp-sec-eyebrow">By the Numbers</div>
              <h2 className="lp-sec-title">Built for performance</h2>
            </div>
            <div className="lp-numbers-grid">
              {[
                { val: 99, suffix: '%', color: '#00d4ff', label: 'Oracle Uptime',     sub: 'Chainlink DON reliability'          },
                { val: 84, suffix: '%', color: '#00ff88', label: 'Avg AI Confidence', sub: 'Across all rebalancing events'      },
                { val: 0,  suffix: '%', color: '#ffd166', label: 'Custody Risk',      sub: 'Your keys, your assets, always'     },
              ].map((n, i) => (
                <div className="lp-num-card" key={i} style={{ borderColor: `${n.color}18` }}>
                  <div className="lp-num-val" style={{ color: n.color }}>
                    <Counter to={n.val} suffix={n.suffix} />
                  </div>
                  <div className="lp-num-label">{n.label}</div>
                  <div className="lp-num-sub">{n.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="lp-section">
          <div className="lp-cta-wrap">
            <div className="lp-cta-box">
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="lp-sec-eyebrow" style={{ textAlign: 'center' }}>Get Started</div>
                <h2 className="lp-cta-title">Ready to automate<br />your portfolio?</h2>
                <p className="lp-cta-sub">
                  Connect MetaMask and let AI manage your DeFi allocations.<br />
                  Free. Transparent. Always running.
                </p>
                {address ? (
                  <button className="lp-btn-primary" style={{ width: '100%' }} onClick={() => onNavigate('dashboard')}>
                    Go to Dashboard →
                  </button>
                ) : (
                  <button className="lp-btn-primary" style={{ width: '100%' }} onClick={connectWallet} disabled={isConnecting}>
                    {isConnecting ? 'Connecting...' : "🦊 Connect Wallet — It's Free"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="lp-footer">
          <div className="lp-footer-grid">
            <div>
              <div className="lp-footer-logo">
                <div className="lp-footer-logo-icon">⬡</div>
                <span className="lp-footer-logo-text">AutoPortfolio</span>
              </div>
              <p className="lp-footer-desc">
                Autonomous DeFi portfolio management powered by Chainlink, CRE, and Gemini AI.
                Built for the Chainlink Convergence Hackathon 2026.
              </p>
            </div>
            <div>
              <div className="lp-footer-col-title">Navigate</div>
              {(['home', 'dashboard', 'whitepaper'] as const).map(p => (
                <button key={p} className="lp-footer-link" onClick={() => onNavigate(p)} style={{ textTransform: 'capitalize' }}>{p}</button>
              ))}
            </div>
            <div>
              <div className="lp-footer-col-title">Powered By</div>
              {['Chainlink Data Streams', 'Chainlink CRE', 'Gemini 1.5 Flash', 'Base Sepolia', 'Next.js 14'].map(t => (
                <div key={t} className="lp-footer-tech">{t}</div>
              ))}
            </div>
          </div>
          <div className="lp-footer-bottom">
            <span className="lp-footer-copy">© 2026 AutoPortfolio · Chainlink Convergence Hackathon · #cre-ai</span>
            <span className="lp-footer-copy">Testnet only · Not financial advice</span>
          </div>
        </div>

      </div>
    </>
  )
}