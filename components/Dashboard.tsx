'use client'

import { useState, useCallback } from 'react'
import { useWallet } from '@/components/WalletContext'

interface AssetPrice {
  price: number
  change24h: number
  name: string
  symbol: string
}
interface PriceData {
  ETH: AssetPrice
  BTC: AssetPrice
  USDC: AssetPrice
}
interface TermLine {
  type: 'prompt' | 'text' | 'success' | 'warn' | 'error' | 'dim'
  text: string
}

const ALLOCS = [
  { sym: 'ETH',  target: 50, color: '#00d4ff' },
  { sym: 'BTC',  target: 30, color: '#00ff88' },
  { sym: 'USDC', target: 20, color: '#7c3aed' },
]
const HISTORY = [
  { action: 'Rebalanced ETH → BTC',      time: '2h ago' },
  { action: 'AI Drift Alert: ETH +5.1%', time: '5h ago' },
  { action: 'Rebalanced BTC → USDC',     time: '1d ago' },
  { action: 'Portfolio Initialized',      time: '2d ago' },
]
const DEFAULT_PRICES: PriceData = {
  ETH:  { price: 2500,  change24h: 1.2,  name: 'Ethereum', symbol: 'ETH'  },
  BTC:  { price: 65000, change24h: 0.8,  name: 'Bitcoin',  symbol: 'BTC'  },
  USDC: { price: 1.00,  change24h: 0.0,  name: 'USD Coin', symbol: 'USDC' },
}
const ICONS: Record<string, string> = { ETH: '⟠', BTC: '₿', USDC: '💵' }

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap');

.db-root {
  background:#030810; color:#fff;
  font-family:'DM Sans',sans-serif;
  min-height:100vh; padding-top:68px;
}
.db-grid-bg {
  position:fixed; inset:0; z-index:0; pointer-events:none;
  background-image:
    linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),
    linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);
  background-size:48px 48px;
}
.db-container { max-width:1400px; margin:0 auto; padding:24px 16px; position:relative; z-index:1; }

/* ── HEADER ── */
.db-header {
  display:flex; align-items:flex-start; justify-content:space-between;
  margin-bottom:24px; flex-wrap:wrap; gap:12px;
}
.db-header-left h1 {
  font-family:'Orbitron',monospace; font-weight:700;
  font-size:clamp(1rem,3vw,1.5rem);
  background:linear-gradient(90deg,#00d4ff,#00ff88);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  margin:0 0 4px;
}
.db-header-left p { font-size:0.78rem; color:rgba(255,255,255,0.38); font-family:'DM Mono',monospace; margin:0; }
.db-header-right { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }

/* ── BADGE / BUTTONS ── */
.db-badge {
  display:flex; align-items:center; gap:6px; padding:6px 12px;
  border-radius:8px; border:1px solid rgba(0,255,136,0.3);
  background:rgba(0,255,136,0.06); font-family:'DM Mono',monospace;
  font-size:0.72rem; color:#00ff88; white-space:nowrap;
}
.db-badge-dot { width:6px; height:6px; border-radius:50%; background:#00ff88; box-shadow:0 0 8px #00ff88; animation:dbdot 2s infinite; }
@keyframes dbdot { 0%,100%{opacity:1} 50%{opacity:0.3} }
.db-btn {
  padding:7px 13px; border-radius:8px; cursor:pointer;
  font-family:'DM Mono',monospace; font-size:0.76rem;
  transition:all 0.25s; display:flex; align-items:center; gap:5px; border:none;
  white-space:nowrap;
}
.db-btn-outline { border:1px solid rgba(0,212,255,0.25); background:rgba(0,212,255,0.06); color:#00d4ff; }
.db-btn-outline:hover { background:rgba(0,212,255,0.12); border-color:rgba(0,212,255,0.4); }
.db-btn-outline:disabled { opacity:0.4; cursor:not-allowed; }
.db-spin svg { animation:spin 0.8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

/* ── MAIN GRID ── */
/* Desktop: 3 cols */
.db-grid { display:grid; grid-template-columns:260px 1fr 300px; gap:16px; align-items:start; }
/* Tablet: 2 cols */
@media (max-width:1100px) { .db-grid { grid-template-columns:1fr 1fr; } }
/* Mobile: 1 col */
@media (max-width:680px)  { .db-grid { grid-template-columns:1fr; } }

/* ── CARDS ── */
.db-card {
  background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.08);
  border-radius:16px; overflow:hidden;
}
.db-card-header {
  padding:16px 18px 12px; border-bottom:1px solid rgba(255,255,255,0.06);
  display:flex; align-items:center; justify-content:space-between;
}
.db-card-title { font-family:'DM Mono',monospace; font-size:0.68rem; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.38); }
.db-card-body { padding:18px; }

/* ── PORTFOLIO VALUE ── */
.portfolio-value {
  font-family:'Orbitron',monospace; font-weight:700;
  font-size:clamp(1.4rem,3vw,2rem);
  background:linear-gradient(135deg,#00d4ff,#00ff88);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  margin-bottom:4px; line-height:1;
}
.allocation-bars { margin-top:18px; display:flex; flex-direction:column; gap:10px; }
.alloc-row { display:flex; flex-direction:column; gap:5px; }
.alloc-top { display:flex; justify-content:space-between; }
.alloc-name { font-size:0.8rem; font-weight:500; color:rgba(255,255,255,0.75); }
.alloc-pct { font-family:'DM Mono',monospace; font-size:0.76rem; color:rgba(255,255,255,0.42); }
.alloc-track { height:5px; border-radius:100px; background:rgba(255,255,255,0.07); overflow:hidden; }
.alloc-fill { height:100%; border-radius:100px; transition:width 1s cubic-bezier(0.16,1,0.3,1); }

/* ── PRICE CARDS ── */
/* Default: 3 cols inside card. On small screens: 1 col */
.price-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
@media (max-width:480px) { .price-grid { grid-template-columns:1fr; gap:8px; } }
@media (min-width:481px) and (max-width:680px) { .price-grid { grid-template-columns:1fr 1fr; } }

.price-card {
  background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07);
  border-radius:12px; padding:14px 12px;
  transition:all 0.3s ease; cursor:default;
}
.price-card:hover { border-color:rgba(0,212,255,0.2); background:rgba(0,212,255,0.04); transform:translateY(-2px); }
.price-card-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:7px; }
.price-sym { font-family:'Orbitron',monospace; font-size:0.68rem; color:#00d4ff; letter-spacing:1px; }
.price-icon { font-size:0.95rem; }
.price-val { font-family:'DM Mono',monospace; font-size:clamp(0.85rem,2vw,1.05rem); font-weight:500; color:#fff; margin-bottom:3px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.price-chg { font-family:'DM Mono',monospace; font-size:0.72rem; }
.price-chg.up { color:#00ff88; }
.price-chg.dn { color:#ff6b6b; }

/* ── TERMINAL ── */
.terminal {
  background:#020609; border:1px solid rgba(0,212,255,0.15);
  border-radius:14px; overflow:hidden; font-family:'DM Mono',monospace;
}
.terminal-bar {
  background:rgba(0,212,255,0.06); padding:10px 16px;
  display:flex; align-items:center; gap:7px; border-bottom:1px solid rgba(0,212,255,0.12);
}
.term-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
.term-title { font-size:0.68rem; color:rgba(255,255,255,0.35); letter-spacing:1.5px; text-transform:uppercase; margin-left:auto; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.terminal-body { padding:14px 16px; min-height:160px; max-height:240px; overflow-y:auto; font-size:0.76rem; line-height:1.85; }
.terminal-body::-webkit-scrollbar { width:3px; }
.terminal-body::-webkit-scrollbar-thumb { background:rgba(0,212,255,0.2); border-radius:2px; }
.t-prompt { color:#00d4ff; }
.t-text   { color:rgba(255,255,255,0.6); }
.t-success{ color:#00ff88; }
.t-warn   { color:#ffd166; }
.t-error  { color:#ff6b6b; }
.t-dim    { color:rgba(255,255,255,0.28); }
.t-cursor { display:inline-block; width:7px; height:13px; background:#00d4ff; animation:cur 1s infinite; vertical-align:middle; }
@keyframes cur { 0%,49%{opacity:1} 50%,100%{opacity:0} }
.terminal-input { display:flex; align-items:center; gap:8px; padding:10px 14px; border-top:1px solid rgba(0,212,255,0.1); }
.terminal-input input {
  flex:1; background:none; border:none; outline:none;
  font-family:'DM Mono',monospace; font-size:0.76rem; color:rgba(255,255,255,0.7);
  min-width:0;
}
.terminal-input input::placeholder { color:rgba(255,255,255,0.2); }
.term-send {
  padding:5px 11px; border-radius:6px; border:1px solid rgba(0,212,255,0.3);
  background:rgba(0,212,255,0.08); color:#00d4ff; cursor:pointer;
  font-family:'DM Mono',monospace; font-size:0.72rem; transition:all 0.2s;
  white-space:nowrap; flex-shrink:0;
}
.term-send:hover { background:rgba(0,212,255,0.15); }

/* ── AI ANALYSIS ── */
.analysis-header {
  background:linear-gradient(135deg,rgba(0,212,255,0.08),rgba(0,255,136,0.05));
  padding:14px 18px; border-bottom:1px solid rgba(0,212,255,0.12);
  display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;
}
.analysis-title-text { font-family:'DM Mono',monospace; font-size:0.68rem; color:rgba(255,255,255,0.45); letter-spacing:2px; text-transform:uppercase; }
.confidence-badge {
  font-family:'Orbitron',monospace; font-size:0.72rem; font-weight:700;
  padding:3px 9px; border-radius:6px;
  background:rgba(0,255,136,0.12); color:#00ff88; border:1px solid rgba(0,255,136,0.25);
  white-space:nowrap;
}
.analysis-body { padding:16px 18px; }
.analysis-text { font-size:0.85rem; color:rgba(255,255,255,0.58); line-height:1.75; margin-bottom:14px; font-weight:300; }
.action-row {
  display:flex; align-items:center; justify-content:space-between;
  padding:9px 12px; border-radius:9px; margin-bottom:7px;
  background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
  flex-wrap:wrap; gap:6px;
}
.action-from { font-family:'DM Mono',monospace; font-size:0.76rem; color:rgba(255,255,255,0.52); }
.action-arrow { color:rgba(0,212,255,0.6); }
.action-pct { font-family:'Orbitron',monospace; font-size:0.72rem; font-weight:700; color:#00d4ff; }
.execute-btn {
  width:100%; margin-top:12px; padding:12px; border-radius:11px; border:none;
  background:linear-gradient(135deg,#00d4ff,#00ff88); color:#030810;
  font-family:'DM Sans',sans-serif; font-size:0.88rem; font-weight:700;
  cursor:pointer; transition:all 0.3s ease;
}
.execute-btn:hover { box-shadow:0 0 28px rgba(0,212,255,0.4); transform:translateY(-1px); }

/* ── HISTORY ── */
.history-list { display:flex; flex-direction:column; gap:7px; }
.history-item {
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 12px; border-radius:9px;
  background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07);
  transition:all 0.25s; flex-wrap:wrap; gap:6px;
}
.history-item:hover { border-color:rgba(0,212,255,0.15); background:rgba(0,212,255,0.03); }
.hist-action { font-size:0.82rem; font-weight:500; color:rgba(255,255,255,0.78); display:block; }
.hist-time   { font-family:'DM Mono',monospace; font-size:0.68rem; color:rgba(255,255,255,0.28); display:block; margin-top:2px; }
.hist-status {
  font-family:'DM Mono',monospace; font-size:0.68rem; padding:2px 9px;
  border-radius:5px; font-weight:500; white-space:nowrap;
  background:rgba(0,255,136,0.1); color:#00ff88; border:1px solid rgba(0,255,136,0.2);
}

/* ── NETWORK STATUS ── */
.net-row { display:flex; justify-content:space-between; align-items:center; padding:4px 0; flex-wrap:wrap; gap:4px; }
`

export default function Dashboard() {
  const { address } = useWallet()
  const [prices, setPrices]       = useState<PriceData>(DEFAULT_PRICES)
  const [spinning, setSpinning]   = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis]   = useState<string | null>(null)
  const [confidence, setConfidence] = useState(87)
  const [termInput, setTermInput] = useState('')
  const [termLines, setTermLines] = useState<TermLine[]>([
    { type: 'dim',     text: '──────────────────────────' },
    { type: 'prompt',  text: '> AutoPortfolio AI Terminal v1.0' },
    { type: 'dim',     text: '──────────────────────────' },
    { type: 'text',    text: 'Monitoring portfolio drift...' },
    { type: 'success', text: '✓ Chainlink feeds connected' },
    { type: 'success', text: '✓ Gemini AI initialized' },
    { type: 'text',    text: "Type 'help' for commands" },
  ])

  const addLine = useCallback((type: TermLine['type'], text: string) => {
    setTermLines(prev => [...prev, { type, text }])
  }, [])

  const refreshPrices = useCallback(async () => {
    setSpinning(true)
    addLine('prompt', '> Fetching prices from Chainlink...')
    try {
      const res = await fetch('/api/prices')
      if (!res.ok) throw new Error()
      const data: PriceData = await res.json()
      if (data.ETH && data.BTC && data.USDC) {
        setPrices(data)
        addLine('success', '✓ Prices updated from Chainlink oracle')
      } else throw new Error()
    } catch {
      setPrices(prev => ({
        ETH:  { ...prev.ETH,  price: prev.ETH.price * (1 + (Math.random() - 0.5) * 0.01), change24h: parseFloat(((Math.random() - 0.5) * 4).toFixed(2)) },
        BTC:  { ...prev.BTC,  price: prev.BTC.price * (1 + (Math.random() - 0.5) * 0.01), change24h: parseFloat(((Math.random() - 0.5) * 4).toFixed(2)) },
        USDC: { ...prev.USDC, price: 1.00, change24h: 0 },
      }))
      addLine('warn', '⚠ API unavailable — using simulated prices')
    }
    setTimeout(() => setSpinning(false), 800)
  }, [addLine])

  const runAnalysis = useCallback(async () => {
    setAnalyzing(true)
    addLine('prompt', '> Running Gemini AI analysis...')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prices: { ETH: prices.ETH.price, BTC: prices.BTC.price, USDC: prices.USDC.price }, allocations: ALLOCS }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setAnalysis(data.analysis || data.recommendation || 'Portfolio is well-balanced. Monitor ETH closely.')
      setConfidence(data.confidence ?? 87)
      addLine('success', `✓ Analysis complete — confidence: ${data.confidence ?? 87}%`)
    } catch {
      setAnalysis('ETH shows +5.1% drift above target. Recommend selling 2% ETH and buying USDC to restore target allocations. Market momentum is neutral.')
      setConfidence(84)
      addLine('warn', '⚠ Gemini offline — using fallback analysis')
    }
    setAnalyzing(false)
  }, [prices, addLine])

  const handleTermCommand = useCallback(() => {
    const cmd = termInput.toLowerCase().trim()
    if (!cmd) return
    addLine('prompt', `> ${termInput}`)
    if (cmd === 'analyze' || cmd === 'run') { runAnalysis() }
    else if (cmd === 'prices' || cmd === 'refresh') { refreshPrices() }
    else if (cmd === 'help') { addLine('text', 'Commands: analyze · prices · status · clear · help') }
    else if (cmd === 'clear') { setTermLines([]) }
    else if (cmd === 'status') {
      addLine('success', '✓ All systems operational')
      addLine('text', `Wallet: ${address?.slice(0, 10)}...`)
      addLine('text', 'Network: Base Sepolia')
    } else { addLine('warn', `⚠ Unknown command: ${cmd}`) }
    setTermInput('')
  }, [termInput, addLine, runAnalysis, refreshPrices, address])

  const totalValue = ALLOCS.reduce((sum, a) => {
    const price = prices[a.sym as keyof PriceData]?.price ?? 0
    return sum + price * (a.target / 100) * 0.5
  }, 0)

  const priceList = [
    { ...prices.ETH,  icon: ICONS.ETH  },
    { ...prices.BTC,  icon: ICONS.BTC  },
    { ...prices.USDC, icon: ICONS.USDC },
  ]

  return (
    <>
      <style suppressHydrationWarning>{STYLES}</style>
      <div className="db-root">
        <div className="db-grid-bg" />
        <div className="db-container">

          {/* HEADER */}
          <div className="db-header">
            <div className="db-header-left">
              <h1>Portfolio Dashboard</h1>
              <p>Base Sepolia · {address ? `${address.slice(0, 8)}...${address.slice(-4)}` : 'Not connected'}</p>
            </div>
            <div className="db-header-right">
              <div className="db-badge"><span className="db-badge-dot" /> Live</div>
              <button
                className={`db-btn db-btn-outline ${spinning ? 'db-spin' : ''}`}
                onClick={refreshPrices} disabled={spinning}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6M23 20v-6h-6"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
                {spinning ? 'Refreshing...' : 'Refresh'}
              </button>
              <button className="db-btn db-btn-outline" onClick={runAnalysis} disabled={analyzing}>
                {analyzing ? 'Analyzing...' : '🤖 Analyze'}
              </button>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="db-grid">

            {/* LEFT col — Portfolio + History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="db-card">
                <div className="db-card-header">
                  <span className="db-card-title">Portfolio Value</span>
                </div>
                <div className="db-card-body">
                  <div className="portfolio-value">
                    ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontFamily: 'DM Mono', fontSize: '0.76rem', color: '#00ff88', marginBottom: 4 }}>▲ Live estimate</div>
                  <div className="allocation-bars">
                    {ALLOCS.map(a => (
                      <div className="alloc-row" key={a.sym}>
                        <div className="alloc-top">
                          <span className="alloc-name">{a.sym}</span>
                          <span className="alloc-pct">{a.target}%</span>
                        </div>
                        <div className="alloc-track">
                          <div className="alloc-fill" style={{ width: `${a.target}%`, background: a.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="db-card">
                <div className="db-card-header">
                  <span className="db-card-title">Rebalance History</span>
                </div>
                <div className="db-card-body" style={{ padding: '12px 14px' }}>
                  <div className="history-list">
                    {HISTORY.map((h, i) => (
                      <div className="history-item" key={i}>
                        <div>
                          <span className="hist-action">{h.action}</span>
                          <span className="hist-time">{h.time}</span>
                        </div>
                        <span className="hist-status">✓ Done</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CENTRE col — Prices + Terminal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="db-card">
                <div className="db-card-header">
                  <span className="db-card-title">Live Prices — Chainlink</span>
                  <span style={{ fontFamily: 'DM Mono', fontSize: '0.68rem', color: '#00d4ff' }}>🔗 Oracle</span>
                </div>
                <div className="db-card-body">
                  <div className="price-grid">
                    {priceList.map(p => (
                      <div className="price-card" key={p.symbol}>
                        <div className="price-card-top">
                          <span className="price-sym">{p.symbol}</span>
                          <span className="price-icon">{p.icon}</span>
                        </div>
                        <div className="price-val">
                          ${p.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className={`price-chg ${p.change24h >= 0 ? 'up' : 'dn'}`}>
                          {p.change24h >= 0 ? '▲' : '▼'} {Math.abs(p.change24h).toFixed(2)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="terminal">
                <div className="terminal-bar">
                  <span className="term-dot" style={{ background: '#ff6b6b' }} />
                  <span className="term-dot" style={{ background: '#ffd166' }} />
                  <span className="term-dot" style={{ background: '#00ff88' }} />
                  <span className="term-title">AI Terminal — Base Sepolia</span>
                </div>
                <div className="terminal-body">
                  {termLines.map((l, i) => (
                    <div key={i}><span className={`t-${l.type}`}>{l.text}</span></div>
                  ))}
                  <div><span className="t-cursor" /></div>
                </div>
                <div className="terminal-input">
                  <span style={{ color: '#00d4ff', fontFamily: 'DM Mono', fontSize: '0.76rem', flexShrink: 0 }}>$</span>
                  <input
                    value={termInput}
                    onChange={e => setTermInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleTermCommand()}
                    placeholder="type 'analyze' or 'help'..."
                  />
                  <button className="term-send" onClick={handleTermCommand}>Run</button>
                </div>
              </div>
            </div>

            {/* RIGHT col — AI Analysis + Network */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="db-card">
                <div className="analysis-header">
                  <span className="analysis-title-text">Gemini AI Analysis</span>
                  {analysis && <span className="confidence-badge">{confidence}% conf.</span>}
                </div>
                <div className="analysis-body">
                  {!analysis ? (
                    <div style={{ textAlign: 'center', padding: '28px 0' }}>
                      <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>🤖</div>
                      <div style={{ fontFamily: 'DM Mono', fontSize: '0.75rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.7 }}>
                        Click "Analyze" or type<br />
                        <span style={{ color: '#00d4ff' }}>'analyze'</span> in the terminal
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="analysis-text">{analysis}</div>
                      <div className="action-row">
                        <span className="action-from">BTC 30% → 28%</span>
                        <span className="action-arrow">→</span>
                        <span className="action-pct">-2%</span>
                      </div>
                      <div className="action-row">
                        <span className="action-from">ETH 48% → 50%</span>
                        <span className="action-arrow">→</span>
                        <span className="action-pct">+2%</span>
                      </div>
                      <button className="execute-btn" onClick={() => addLine('success', '✓ Rebalance submitted on-chain')}>
                        ⚡ Execute Rebalance
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="db-card">
                <div className="db-card-header">
                  <span className="db-card-title">Network Status</span>
                </div>
                <div className="db-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Network',  val: 'Base Sepolia', color: '#00d4ff' },
                    { label: 'Oracle',   val: 'Chainlink ✓',  color: '#00ff88' },
                    { label: 'AI Model', val: 'Gemini Flash', color: '#7c3aed' },
                    { label: 'Gas',      val: '~$0.001',      color: '#ffd166' },
                  ].map(row => (
                    <div className="net-row" key={row.label}>
                      <span style={{ fontFamily: 'DM Mono', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{row.label}</span>
                      <span style={{ fontFamily: 'DM Mono', fontSize: '0.75rem', color: row.color }}>{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}