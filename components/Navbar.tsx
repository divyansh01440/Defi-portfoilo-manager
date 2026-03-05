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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(5,8,16,0.96)' : 'rgba(5,8,16,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(55,91,210,0.2)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', height: 64,
        }}>

          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: 0 }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #375BD2, #00e5b0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0,
            }}>⬡</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: '#e8edf5', letterSpacing: '-0.3px' }}>
              AutoPortfolio
            </span>
          </button>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {([
              { label: 'Home', page: 'home' as const },
              { label: 'Whitepaper', page: 'whitepaper' as const },
            ] as const).map(item => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                style={{
                  background: currentPage === item.page ? 'rgba(55,91,210,0.15)' : 'transparent',
                  border: currentPage === item.page ? '1px solid rgba(55,91,210,0.3)' : '1px solid transparent',
                  borderRadius: 8, padding: '7px 16px',
                  fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14,
                  color: currentPage === item.page ? '#e8edf5' : '#7a8499',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (currentPage !== item.page) {
                    (e.currentTarget as HTMLButtonElement).style.color = '#e8edf5'
                    ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(55,91,210,0.08)'
                  }
                }}
                onMouseLeave={e => {
                  if (currentPage !== item.page) {
                    (e.currentTarget as HTMLButtonElement).style.color = '#7a8499'
                    ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  }
                }}
              >
                {item.label}
              </button>
            ))}

            {/* Dashboard — wallet-gated */}
            <button
              onClick={() => address && onNavigate('dashboard')}
              title={!address ? 'Connect wallet to access Dashboard' : ''}
              style={{
                background: currentPage === 'dashboard' ? 'rgba(55,91,210,0.15)' : 'transparent',
                border: currentPage === 'dashboard' ? '1px solid rgba(55,91,210,0.3)' : '1px solid transparent',
                borderRadius: 8, padding: '7px 16px',
                fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14,
                color: !address ? '#3d4a6b' : currentPage === 'dashboard' ? '#e8edf5' : '#7a8499',
                cursor: !address ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
              onMouseEnter={e => {
                if (address && currentPage !== 'dashboard') {
                  (e.currentTarget as HTMLButtonElement).style.color = '#e8edf5'
                  ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(55,91,210,0.08)'
                }
              }}
              onMouseLeave={e => {
                if (address && currentPage !== 'dashboard') {
                  (e.currentTarget as HTMLButtonElement).style.color = '#7a8499'
                  ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                }
              }}
            >
              {!address && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              )}
              Dashboard
            </button>
          </div>

          {/* Wallet button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {address ? (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(0,229,176,0.1)', border: '1px solid rgba(0,229,176,0.25)',
                  borderRadius: 8, padding: '6px 12px',
                }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%', background: '#00e5b0',
                    boxShadow: '0 0 6px #00e5b0', animation: 'nb-pulse 2s ease-in-out infinite',
                  }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#00e5b0' }}>{short}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  style={{
                    background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.25)',
                    borderRadius: 8, padding: '6px 12px',
                    fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 13,
                    color: '#ff4d6d', cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,77,109,0.2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,77,109,0.1)'}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                style={{
                  background: isConnecting ? 'rgba(55,91,210,0.3)' : 'linear-gradient(135deg, #375BD2, #4a6ee0)',
                  border: 'none', borderRadius: 10, padding: '9px 20px',
                  fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14,
                  color: '#fff', cursor: isConnecting ? 'not-allowed' : 'pointer',
                  boxShadow: isConnecting ? 'none' : '0 0 20px rgba(55,91,210,0.35)',
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => { if (!isConnecting) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'}
              >
                {isConnecting ? (
                  <>
                    <span style={{
                      width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff', borderRadius: '50%',
                      display: 'inline-block', animation: 'nb-spin 0.8s linear infinite',
                    }} />
                    Connecting...
                  </>
                ) : '🦊 Connect MetaMask'}
              </button>
            )}
          </div>

        </div>
      </nav>

      <style suppressHydrationWarning>{`
        @keyframes nb-pulse { 0%,100% { opacity:1; box-shadow:0 0 6px #00e5b0; } 50% { opacity:0.5; box-shadow:0 0 2px #00e5b0; } }
        @keyframes nb-spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}