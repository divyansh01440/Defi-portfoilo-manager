'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/components/WalletContext'

interface NavbarProps {
  currentPage: 'home' | 'dashboard' | 'whitepaper'
  onNavigate: (page: 'home' | 'dashboard' | 'whitepaper') => void
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { address, connectWallet, disconnectWallet, isConnecting } = useWallet()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleNav = (page: 'home' | 'dashboard' | 'whitepaper') => {
    setMenuOpen(false)
    if (page === 'dashboard' && !address) return
    onNavigate(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled || menuOpen ? 'rgba(5,8,16,0.97)' : 'rgba(5,8,16,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(55,91,210,0.2)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: 64,
        }}>
          {/* Logo */}
          <button onClick={() => handleNav('home')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, padding: 0, flexShrink: 0,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #375BD2, #00e5b0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, flexShrink: 0,
            }}>⬡</div>
            <span style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 17,
              color: '#e8edf5', letterSpacing: '-0.3px',
            }}>AutoPortfolio</span>
          </button>

          {/* Desktop links — hidden on mobile via CSS */}
          <div className="nb-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {(['home', 'whitepaper'] as const).map(p => (
              <button key={p} onClick={() => handleNav(p)} style={{
                background: currentPage === p ? 'rgba(55,91,210,0.15)' : 'transparent',
                border: currentPage === p ? '1px solid rgba(55,91,210,0.3)' : '1px solid transparent',
                borderRadius: 8, padding: '7px 16px',
                fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14,
                color: currentPage === p ? '#e8edf5' : '#7a8499',
                cursor: 'pointer', transition: 'all 0.2s ease', textTransform: 'capitalize',
              }}>{p}</button>
            ))}
            <button onClick={() => handleNav('dashboard')} style={{
              background: currentPage === 'dashboard' ? 'rgba(55,91,210,0.15)' : 'transparent',
              border: currentPage === 'dashboard' ? '1px solid rgba(55,91,210,0.3)' : '1px solid transparent',
              borderRadius: 8, padding: '7px 16px',
              fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14,
              color: !address ? '#3d4a6b' : currentPage === 'dashboard' ? '#e8edf5' : '#7a8499',
              cursor: !address ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {!address && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
              Dashboard
            </button>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

            {/* Desktop wallet — hidden on mobile via CSS */}
            <div className="nb-desktop-wallet" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {address ? (
                <>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'rgba(0,229,176,0.1)', border: '1px solid rgba(0,229,176,0.25)',
                    borderRadius: 8, padding: '6px 12px',
                  }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00e5b0', boxShadow: '0 0 6px #00e5b0' }} />
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#00e5b0' }}>{short}</span>
                  </div>
                  <button onClick={disconnectWallet} style={{
                    background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.25)',
                    borderRadius: 8, padding: '6px 12px',
                    fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 13,
                    color: '#ff4d6d', cursor: 'pointer',
                  }}>Disconnect</button>
                </>
              ) : (
                <button onClick={connectWallet} disabled={isConnecting} style={{
                  background: isConnecting ? 'rgba(55,91,210,0.3)' : 'linear-gradient(135deg, #375BD2, #4a6ee0)',
                  border: 'none', borderRadius: 10, padding: '9px 18px',
                  fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14,
                  color: '#fff', cursor: isConnecting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 20px rgba(55,91,210,0.35)',
                }}>
                  {isConnecting ? 'Connecting...' : '🦊 Connect'}
                </button>
              )}
            </div>

            {/* Hamburger — shown only on mobile via CSS */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="nb-hamburger"
              aria-label="Toggle menu"
              style={{
                background: 'rgba(55,91,210,0.1)', border: '1px solid rgba(55,91,210,0.2)',
                borderRadius: 8, width: 40, height: 40, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 5,
              }}
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: 'block', width: 20, height: 2, background: '#e8edf5', borderRadius: 2,
                  transition: 'all 0.3s',
                  transform: menuOpen
                    ? i === 0 ? 'translateY(7px) rotate(45deg)'
                      : i === 2 ? 'translateY(-7px) rotate(-45deg)'
                      : 'scaleX(0)'
                    : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid rgba(55,91,210,0.15)',
            background: 'rgba(5,8,16,0.98)',
            padding: '16px',
          }}>
            {(['home', 'whitepaper', 'dashboard'] as const).map(p => (
              <button key={p} onClick={() => handleNav(p)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: currentPage === p ? 'rgba(55,91,210,0.15)' : 'transparent',
                border: '1px solid ' + (currentPage === p ? 'rgba(55,91,210,0.3)' : 'transparent'),
                borderRadius: 10, padding: '13px 16px', marginBottom: 8,
                fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 15,
                color: (p === 'dashboard' && !address) ? '#3d4a6b' : currentPage === p ? '#e8edf5' : '#a0aec0',
                cursor: (p === 'dashboard' && !address) ? 'not-allowed' : 'pointer',
                textTransform: 'capitalize',
              }}>
                {p === 'dashboard' && !address ? '🔒 ' : ''}{p}
              </button>
            ))}

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(55,91,210,0.1)' }}>
              {address ? (
                <>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                    background: 'rgba(0,229,176,0.08)', border: '1px solid rgba(0,229,176,0.2)',
                    borderRadius: 10, padding: '10px 14px',
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5b0', boxShadow: '0 0 6px #00e5b0' }} />
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#00e5b0' }}>{short}</span>
                  </div>
                  <button onClick={() => { disconnectWallet(); setMenuOpen(false) }} style={{
                    width: '100%', background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.25)',
                    borderRadius: 10, padding: '12px',
                    fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14,
                    color: '#ff4d6d', cursor: 'pointer',
                  }}>Disconnect Wallet</button>
                </>
              ) : (
                <button onClick={() => { connectWallet(); setMenuOpen(false) }} disabled={isConnecting} style={{
                  width: '100%', background: 'linear-gradient(135deg, #375BD2, #4a6ee0)',
                  border: 'none', borderRadius: 10, padding: '14px',
                  fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15,
                  color: '#fff', cursor: 'pointer', boxShadow: '0 0 20px rgba(55,91,210,0.3)',
                }}>
                  {isConnecting ? 'Connecting...' : '🦊 Connect MetaMask'}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <style suppressHydrationWarning>{`
        /* Mobile first: hamburger visible, desktop items hidden */
        .nb-hamburger { display: flex !important; }
        .nb-desktop-links { display: none !important; }
        .nb-desktop-wallet { display: none !important; }

        /* Tablet and up: flip the visibility */
        @media (min-width: 768px) {
          .nb-hamburger { display: none !important; }
          .nb-desktop-links { display: flex !important; }
          .nb-desktop-wallet { display: flex !important; }
        }
      `}</style>
    </>
  )
}