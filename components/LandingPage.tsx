'use client'

import { useEffect, useRef, useState } from 'react'
import { useWallet } from '@/components/WalletContext'

function Counter({ to, prefix = '', suffix = '', duration = 2000 }: {
  to: number; prefix?: string; suffix?: string; duration?: number
}) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = Date.now()
        const tick = () => {
          const progress = Math.min((Date.now() - start) / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          setVal(Math.round(ease * to))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to, duration])
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

function HeroBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(55,91,210,0.07) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      <div style={{
        position: 'absolute', top: '10%', left: '5%',
        width: 'clamp(200px, 40vw, 500px)', height: 'clamp(200px, 40vw, 500px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(55,91,210,0.15) 0%, transparent 70%)',
        animation: 'lp-float1 8s ease-in-out infinite', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '30%', right: '0%',
        width: 'clamp(150px, 30vw, 400px)', height: 'clamp(150px, 30vw, 400px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,176,0.1) 0%, transparent 70%)',
        animation: 'lp-float2 10s ease-in-out infinite', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
        background: 'linear-gradient(to bottom, transparent, #050810)',
      }} />
    </div>
  )
}

function FeatureCard({ icon, title, desc, color, delay }: {
  icon: string; title: string; desc: string; color: string; delay: number
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(13,18,33,0.8)',
        border: hovered ? `1px solid ${color}44` : '1px solid rgba(55,91,210,0.12)',
        borderRadius: 16, padding: '24px 20px',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 60px ${color}15` : 'none',
        animation: `lp-fadeUp 0.6s ease ${delay}s both`,
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${color}18`, border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, marginBottom: 14,
        transition: 'transform 0.3s ease',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
      }}>{icon}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#e8edf5', marginBottom: 8 }}>{title}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, lineHeight: 1.7, color: '#7a8499' }}>{desc}</div>
    </div>
  )
}

function StepCard({ num, title, desc, color, delay }: {
  num: string; title: string; desc: string; color: string; delay: number
}) {
  return (
    <div style={{ display: 'flex', gap: 16, animation: `lp-slideLeft 0.6s ease ${delay}s both` }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 16, color,
      }}>{num}</div>
      <div style={{ paddingTop: 2 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#e8edf5', marginBottom: 5 }}>{title}</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, lineHeight: 1.7, color: '#7a8499' }}>{desc}</div>
      </div>
    </div>
  )
}

interface LandingPageProps {
  onNavigate: (page: 'home' | 'dashboard' | 'whitepaper') => void
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const { address, connectWallet, isConnecting } = useWallet()

  return (
    <div style={{ background: '#050810', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <HeroBackground />
        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: 1200, margin: '0 auto',
          padding: '100px 20px 70px',
          width: '100%',
        }}>
          <div style={{ maxWidth: 760 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(55,91,210,0.12)', border: '1px solid rgba(55,91,210,0.3)',
              borderRadius: 100, padding: '5px 12px', marginBottom: 24,
              animation: 'lp-fadeUp 0.5s ease 0.1s both',
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#00e5b0', boxShadow: '0 0 8px #00e5b0',
                animation: 'lp-pulse 2s ease-in-out infinite', flexShrink: 0,
              }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#a0aec0', letterSpacing: '0.5px' }}>
                Chainlink Convergence Hackathon 2026 · #cre-ai
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(32px, 7vw, 72px)', lineHeight: 1.08,
              color: '#e8edf5', margin: '0 0 20px',
              animation: 'lp-fadeUp 0.6s ease 0.2s both',
              letterSpacing: '-1px',
            }}>
              Your Portfolio,<br />
              <span style={{
                background: 'linear-gradient(135deg, #375BD2, #00e5b0)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Autonomously</span><br />
              Managed.
            </h1>

            {/* Subtitle */}
            <p style={{
              fontFamily: 'Syne, sans-serif', fontSize: 'clamp(14px, 2.5vw, 19px)',
              color: '#7a8499', margin: '0 0 32px', lineHeight: 1.65, maxWidth: 540,
              animation: 'lp-fadeUp 0.6s ease 0.3s both',
            }}>
              AutoPortfolio uses Chainlink Data Streams, CRE Workflows, and Gemini AI
              to continuously rebalance your DeFi portfolio — 24/7, on-chain, no spreadsheets required.
            </p>

            {/* CTAs */}
            <div style={{
              display: 'flex', gap: 12, flexWrap: 'wrap',
              animation: 'lp-fadeUp 0.6s ease 0.4s both',
            }}>
              {address ? (
                <button onClick={() => onNavigate('dashboard')} style={{
                  background: 'linear-gradient(135deg, #375BD2, #4a6ee0)',
                  border: 'none', borderRadius: 12, padding: '13px 24px',
                  fontFamily: 'Syne, sans-serif', fontWeight: 700,
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  color: '#fff', cursor: 'pointer',
                  boxShadow: '0 0 32px rgba(55,91,210,0.4)',
                  transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                }}>
                  Open Dashboard →
                </button>
              ) : (
                <button onClick={connectWallet} disabled={isConnecting} style={{
                  background: isConnecting ? 'rgba(55,91,210,0.4)' : 'linear-gradient(135deg, #375BD2, #4a6ee0)',
                  border: 'none', borderRadius: 12, padding: '13px 24px',
                  fontFamily: 'Syne, sans-serif', fontWeight: 700,
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  color: '#fff', cursor: isConnecting ? 'not-allowed' : 'pointer',
                  boxShadow: isConnecting ? 'none' : '0 0 32px rgba(55,91,210,0.4)',
                  transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                }}>
                  {isConnecting ? 'Connecting...' : '🦊 Connect Wallet to Start'}
                </button>
              )}
              <button onClick={() => onNavigate('whitepaper')} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12, padding: '13px 24px',
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: 'clamp(14px, 2vw, 16px)',
                color: '#a0aec0', cursor: 'pointer', transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}>
                Read Whitepaper
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{
        padding: 'clamp(40px, 6vw, 80px) 20px',
        borderTop: '1px solid rgba(55,91,210,0.1)',
        borderBottom: '1px solid rgba(55,91,210,0.1)',
        background: 'rgba(13,18,33,0.5)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="lp-stats-grid">
            {[
              { label: 'Managed Portfolio', value: 10000, prefix: '$', suffix: '' },
              { label: 'Assets Tracked', value: 3, prefix: '', suffix: '+' },
              { label: 'AI Confidence (avg)', value: 82, prefix: '', suffix: '%' },
              { label: 'Price Refresh', value: 30, prefix: '', suffix: 's' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                  fontSize: 'clamp(24px, 4vw, 42px)', color: '#e8edf5', marginBottom: 6,
                }}>
                  <Counter to={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontSize: 'clamp(11px, 1.5vw, 14px)',
                  color: '#7a8499', textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(36px, 5vw, 60px)' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#375BD2', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14 }}>Features</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(22px, 4vw, 44px)', color: '#e8edf5', margin: '0 0 14px', letterSpacing: '-0.5px' }}>
              Everything a trading desk does,<br className="lp-br-hide" /> automated for you
            </h2>
            <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(14px, 2vw, 17px)', color: '#7a8499', maxWidth: 480, margin: '0 auto' }}>
              Institutional-grade portfolio management powered by decentralized infrastructure and AI reasoning.
            </p>
          </div>
          <div className="lp-features-grid">
            <FeatureCard icon="⛓️" title="Chainlink Data Streams" color="#375BD2" delay={0}
              desc="Tamper-proof, real-time prices verified on-chain. No stale feeds, no manipulation risk — every decision is based on cryptographically guaranteed data." />
            <FeatureCard icon="⚡" title="CRE Workflow Engine" color="#5b7fe8" delay={0.05}
              desc="Chainlink Runtime Environment triggers rebalancing only when drift thresholds are crossed. Smart automation that avoids over-trading on noise." />
            <FeatureCard icon="🧠" title="Gemini AI Reasoning" color="#00e5b0" delay={0.1}
              desc="Not just rules — actual reasoning. Gemini 1.5 Flash weighs momentum, sentiment, and risk to make nuanced portfolio decisions." />
            <FeatureCard icon="🦊" title="MetaMask Integration" color="#f7931a" delay={0.15}
              desc="Connect your wallet in one click. All rebalancing operations are visible, transparent, and execute with your wallet signature on Base Sepolia." />
            <FeatureCard icon="🛡️" title="Multi-Layer Security" color="#ff4d6d" delay={0.2}
              desc="Confidence thresholds, slippage guards, cooldown periods, and human override — four independent safety layers protect your assets." />
            <FeatureCard icon="📊" title="Live Portfolio Analytics" color="#f59e0b" delay={0.25}
              desc="Real-time allocation charts, drift tracking, and execution logs. See exactly what the AI is doing and why, with full on-chain auditability." />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{
        padding: 'clamp(60px, 8vw, 100px) 20px',
        background: 'rgba(13,18,33,0.5)',
        borderTop: '1px solid rgba(55,91,210,0.1)',
        borderBottom: '1px solid rgba(55,91,210,0.1)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="lp-hiw-grid">
            {/* Steps */}
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#375BD2', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14 }}>How It Works</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(22px, 3vw, 38px)', color: '#e8edf5', margin: '0 0 32px', letterSpacing: '-0.5px' }}>
                Four-stage pipeline.<br />Always running.
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <StepCard num="01" title="Observe" color="#375BD2" delay={0}
                  desc="Chainlink Data Streams deliver live ETH, BTC, and USDC prices signed by the Decentralized Oracle Network and verified on-chain." />
                <StepCard num="02" title="Trigger" color="#5b7fe8" delay={0.1}
                  desc="CRE Workflow Engine checks if any asset has drifted more than 5% from its target. Only fires when action is genuinely needed." />
                <StepCard num="03" title="Reason" color="#00e5b0" delay={0.2}
                  desc="Gemini AI receives full portfolio context and returns a structured JSON decision: which assets to buy, sell, or hold, with confidence and reasoning." />
                <StepCard num="04" title="Execute" color="#f7931a" delay={0.3}
                  desc="Approved swaps execute on Base Sepolia via Uniswap V3. Every action is logged on-chain with a transaction hash and audit trail." />
              </div>
            </div>

            {/* Terminal mock */}
            <div style={{
              background: '#000', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16, overflow: 'hidden',
              animation: 'lp-fadeUp 0.8s ease 0.2s both',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px',
                background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57', flexShrink: 0 }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e', flexShrink: 0 }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840', flexShrink: 0 }} />
                <span style={{ marginLeft: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#7a8499', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  AutoPortfolio CRE — Base Sepolia
                </span>
              </div>
              <div style={{ padding: '16px 18px', overflowX: 'auto' }}>
                {[
                  { t: '09:14:20', col: '#3d4a6b', msg: 'CRE Workflow triggered — drift check' },
                  { t: '09:14:21', col: '#375BD2', msg: 'Chainlink stream: ETH $2,847.50 ✓' },
                  { t: '09:14:21', col: '#375BD2', msg: 'ETH drift: +5.1% (threshold: 5%) ⚡' },
                  { t: '09:14:22', col: '#00e5b0', msg: 'Gemini AI reasoning...' },
                  { t: '09:14:23', col: '#00e5b0', msg: 'Decision: SELL ETH → BUY USDC (84%)' },
                  { t: '09:14:24', col: '#f59e0b', msg: 'Slippage check: 0.12% < 0.5% ✓' },
                  { t: '09:14:25', col: '#f59e0b', msg: 'Cooldown check: 18h > 4h ✓' },
                  { t: '09:14:26', col: '#00e5b0', msg: 'TX confirmed: 0x3f8a...c91d ✓' },
                ].map((line, i) => (
                  <div key={i} style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(10px, 1.5vw, 12px)',
                    lineHeight: 2, color: '#a0aec0',
                    animation: `lp-fadeIn 0.3s ease ${0.5 + i * 0.15}s both`,
                    whiteSpace: 'nowrap',
                  }}>
                    <span style={{ color: '#3d4a6b' }}>[{line.t}]</span>{' '}
                    <span style={{ color: line.col }}>◆</span>{' '}
                    {line.msg}
                  </div>
                ))}
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#3d4a6b', animation: 'lp-blink 1s step-end infinite' }}>▋</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NUMBERS ── */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(36px, 5vw, 60px)' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#375BD2', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14 }}>By the Numbers</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(22px, 4vw, 44px)', color: '#e8edf5', margin: 0 }}>Built for performance</h2>
          </div>
          <div className="lp-numbers-grid">
            {[
              { value: 99, suffix: '%', label: 'Oracle Uptime', sub: 'Chainlink DON reliability', color: '#375BD2' },
              { value: 84, suffix: '%', label: 'Avg AI Confidence', sub: 'Across all rebalancing events', color: '#00e5b0' },
              { value: 0, suffix: '%', label: 'Custody Risk', sub: 'Your keys, your assets, always', color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'rgba(13,18,33,0.8)', border: `1px solid ${s.color}22`,
                borderRadius: 16, padding: 'clamp(20px, 3vw, 32px)', textAlign: 'center',
                animation: `lp-fadeUp 0.6s ease ${i * 0.1}s both`,
              }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 'clamp(36px, 6vw, 56px)', color: s.color, lineHeight: 1, marginBottom: 8 }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(15px, 2vw, 18px)', color: '#e8edf5', marginBottom: 5 }}>{s.label}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, color: '#7a8499' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{
        padding: 'clamp(60px, 8vw, 100px) 20px',
        background: 'rgba(13,18,33,0.5)',
        borderTop: '1px solid rgba(55,91,210,0.1)',
        borderBottom: '1px solid rgba(55,91,210,0.1)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(36px, 5vw, 60px)' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#375BD2', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14 }}>Team</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(22px, 4vw, 44px)', color: '#e8edf5', margin: 0 }}>Who built this</h2>
          </div>
          <div className="lp-team-grid">
            {[
              { name: 'DeFi Builder', role: 'Full-Stack Developer', initials: 'DB', color: '#375BD2', bio: 'Next.js, Solidity, Chainlink integrations' },
              { name: 'AI Engineer', role: 'ML & Reasoning Layer', initials: 'AE', color: '#00e5b0', bio: 'Gemini API, prompt engineering, structured outputs' },
            ].map((member, i) => (
              <div key={i} style={{
                background: 'rgba(13,18,33,0.8)', border: `1px solid ${member.color}22`,
                borderRadius: 16, padding: 'clamp(20px, 3vw, 32px)', textAlign: 'center',
                animation: `lp-fadeUp 0.6s ease ${i * 0.15}s both`,
              }}>
                <div style={{
                  width: 68, height: 68, borderRadius: '50%', margin: '0 auto 14px',
                  background: `linear-gradient(135deg, ${member.color}33, ${member.color}11)`,
                  border: `2px solid ${member.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: member.color,
                }}>{member.initials}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 17, color: '#e8edf5', marginBottom: 4 }}>{member.name}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: member.color, marginBottom: 10 }}>{member.role}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, color: '#7a8499', lineHeight: 1.6 }}>{member.bio}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 20px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: 'rgba(55,91,210,0.06)', border: '1px solid rgba(55,91,210,0.2)',
            borderRadius: 20, padding: 'clamp(32px, 5vw, 60px) clamp(20px, 4vw, 40px)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
              width: 350, height: 350, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(55,91,210,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(22px, 4vw, 40px)', color: '#e8edf5', margin: '0 0 14px', letterSpacing: '-0.5px' }}>
                Ready to automate<br />your portfolio?
              </h2>
              <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(13px, 1.8vw, 16px)', color: '#7a8499', margin: '0 0 28px', lineHeight: 1.6 }}>
                Connect MetaMask and let AI manage your DeFi allocations.<br />Free. Transparent. Always running.
              </p>
              {address ? (
                <button onClick={() => onNavigate('dashboard')} style={{
                  background: 'linear-gradient(135deg, #375BD2, #4a6ee0)',
                  border: 'none', borderRadius: 12, padding: '14px 32px',
                  fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16,
                  color: '#fff', cursor: 'pointer', boxShadow: '0 0 40px rgba(55,91,210,0.4)',
                  width: '100%', maxWidth: 280,
                }}>
                  Go to Dashboard →
                </button>
              ) : (
                <button onClick={connectWallet} disabled={isConnecting} style={{
                  background: isConnecting ? 'rgba(55,91,210,0.4)' : 'linear-gradient(135deg, #375BD2, #4a6ee0)',
                  border: 'none', borderRadius: 12, padding: '14px 32px',
                  fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16,
                  color: '#fff', cursor: isConnecting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 40px rgba(55,91,210,0.4)',
                  width: '100%', maxWidth: 300,
                }}>
                  {isConnecting ? 'Connecting...' : "🦊 Connect Wallet — It's Free"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(55,91,210,0.12)', padding: 'clamp(32px, 5vw, 48px) 20px', background: 'rgba(13,18,33,0.6)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="lp-footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, background: 'linear-gradient(135deg, #375BD2, #00e5b0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>⬡</div>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 17, color: '#e8edf5' }}>AutoPortfolio</span>
              </div>
              <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, color: '#7a8499', lineHeight: 1.7, maxWidth: 260, margin: 0 }}>
                Autonomous DeFi portfolio management powered by Chainlink, CRE, and Gemini AI. Built for the Chainlink Convergence Hackathon 2026.
              </p>
            </div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 12, color: '#e8edf5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>Navigate</div>
              {[
                { label: 'Home', page: 'home' as const },
                { label: 'Dashboard', page: 'dashboard' as const },
                { label: 'Whitepaper', page: 'whitepaper' as const },
              ].map(item => (
                <button key={item.page} onClick={() => onNavigate(item.page)} style={{
                  display: 'block', background: 'none', border: 'none',
                  fontFamily: 'Syne, sans-serif', fontSize: 13, color: '#7a8499',
                  cursor: 'pointer', padding: '4px 0', textAlign: 'left',
                }}>{item.label}</button>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 12, color: '#e8edf5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>Powered By</div>
              {['Chainlink Data Streams', 'Chainlink CRE', 'Gemini 1.5 Flash', 'Base Sepolia', 'Next.js 14'].map(tech => (
                <div key={tech} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#7a8499', padding: '3px 0' }}>{tech}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(55,91,210,0.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#3d4a6b' }}>© 2026 AutoPortfolio · Chainlink Convergence Hackathon · #cre-ai</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#3d4a6b' }}>Testnet only · Not financial advice</div>
          </div>
        </div>
      </footer>

      <style suppressHydrationWarning>{`
        @keyframes lp-fadeUp    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes lp-slideLeft { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes lp-fadeIn    { from { opacity:0; } to { opacity:1; } }
        @keyframes lp-float1    { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(20px,-30px) scale(1.05); } }
        @keyframes lp-float2    { 0%,100% { transform:translate(0,0); } 50% { transform:translate(-30px,20px); } }
        @keyframes lp-pulse     { 0%,100% { opacity:1; box-shadow:0 0 8px #00e5b0; } 50% { opacity:0.5; box-shadow:0 0 3px #00e5b0; } }
        @keyframes lp-blink     { 0%,100% { opacity:1; } 50% { opacity:0; } }

        /* Stats: 2 cols mobile → 4 cols desktop */
        .lp-stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px 12px; }
        @media (min-width:640px) { .lp-stats-grid { grid-template-columns:repeat(4,1fr); } }

        /* Features: 1 col → 2 cols → 3 cols */
        .lp-features-grid { display:grid; grid-template-columns:1fr; gap:14px; }
        @media (min-width:540px) { .lp-features-grid { grid-template-columns:1fr 1fr; } }
        @media (min-width:900px) { .lp-features-grid { grid-template-columns:1fr 1fr 1fr; } }

        /* How it works: 1 col → 2 cols */
        .lp-hiw-grid { display:grid; grid-template-columns:1fr; gap:40px; }
        @media (min-width:860px) { .lp-hiw-grid { grid-template-columns:1fr 1fr; gap:64px; align-items:center; } }

        /* Numbers: 1 col → 3 cols */
        .lp-numbers-grid { display:grid; grid-template-columns:1fr; gap:14px; }
        @media (min-width:560px) { .lp-numbers-grid { grid-template-columns:1fr 1fr 1fr; } }

        /* Team: 1 col → 2 cols */
        .lp-team-grid { display:flex; flex-direction:column; gap:16px; align-items:center; }
        @media (min-width:560px) { .lp-team-grid { flex-direction:row; justify-content:center; flex-wrap:wrap; } }
        .lp-team-grid > div { width:100%; max-width:300px; }

        /* Footer: 1 col → 3 cols */
        .lp-footer-grid { display:grid; grid-template-columns:1fr; gap:32px; margin-bottom:32px; }
        @media (min-width:640px) { .lp-footer-grid { grid-template-columns:2fr 1fr 1fr; gap:32px; } }

        /* Hide line break on small screens */
        .lp-br-hide { display:none; }
        @media (min-width:600px) { .lp-br-hide { display:block; } }
      `}</style>
    </div>
  )
}