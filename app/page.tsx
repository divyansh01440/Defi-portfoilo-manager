'use client'

import { useState, useEffect } from 'react'
import { WalletProvider, useWallet } from '@/components/WalletContext'
import Navbar from '@/components/Navbar'
import LandingPage from '@/components/LandingPage'
import Dashboard from '@/components/Dashboard'
import Whitepaper from '@/components/Whitepaper'

type Page = 'home' | 'dashboard' | 'whitepaper'

function AppContent() {
  const [page, setPage] = useState<Page>('home')
  const [pendingDashboard, setPendingDashboard] = useState(false)
  const { address } = useWallet()

  // If user was waiting to go to dashboard and wallet just connected → navigate
  useEffect(() => {
    if (address && pendingDashboard) {
      setPage('dashboard')
      setPendingDashboard(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [address, pendingDashboard])

  // If wallet disconnects while on dashboard → go home
  useEffect(() => {
    if (!address && page === 'dashboard') {
      setPage('home')
    }
  }, [address, page])

  const handleNavigate = (target: Page) => {
    if (target === 'dashboard') {
      if (address) {
        // Wallet already connected — go straight in
        setPage('dashboard')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        // Not connected — set pending flag so we navigate after connect
        setPendingDashboard(true)
      }
      return
    }
    setPage(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Navbar currentPage={page} onNavigate={handleNavigate} />
      {page === 'home'       && <LandingPage onNavigate={handleNavigate} />}
      {page === 'dashboard'  && <Dashboard />}
      {page === 'whitepaper' && <Whitepaper />}
    </>
  )
}

export default function Home() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  )
}