'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'

export interface WalletContextType {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: number | null
  balance: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  error: string | null
}

const defaultContext: WalletContextType = {
  address: null,
  isConnected: false,
  isConnecting: false,
  chainId: null,
  balance: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  error: null,
}

export const WalletContext = createContext<WalletContextType>(defaultContext)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress]           = useState<string | null>(null)
  const [isConnected, setIsConnected]   = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId]           = useState<number | null>(null)
  const [balance, setBalance]           = useState<string | null>(null)
  const [error, setError]               = useState<string | null>(null)

  const disconnectWallet = useCallback(() => {
    setAddress(null)
    setIsConnected(false)
    setChainId(null)
    setBalance(null)
    setError(null)
    setIsConnecting(false)
  }, [])

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask not installed. Please install it from metamask.io')
      return
    }

    if (isConnecting) return

    setIsConnecting(true)
    setError(null)

    try {
      // Use eth_requestAccounts — works reliably on all browsers and Vercel
      const accounts: string[] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from MetaMask.')
      }

      const userAddress = accounts[0]

      const rawChainId: string = await window.ethereum.request({
        method: 'eth_chainId',
      })

      const rawBalance: string = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [userAddress, 'latest'],
      })

      setAddress(userAddress)
      setChainId(parseInt(rawChainId, 16))
      setBalance((parseInt(rawBalance, 16) / 1e18).toFixed(4))
      setIsConnected(true)

    } catch (err: any) {
      // User rejected or closed MetaMask — reset silently
      if (err?.code === 4001) {
        setError(null)
      } else if (err?.code === -32002) {
        setError('MetaMask is already open. Check your browser extension.')
      } else {
        setError(err?.message ?? 'Failed to connect wallet')
      }
      setAddress(null)
      setIsConnected(false)
    } finally {
      setIsConnecting(false)
    }
  }, [isConnecting])

  // Listen for account/chain changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet()
      } else {
        setAddress(accounts[0])
      }
    }

    const handleChainChanged = () => {
      // Reload on chain change as recommended by MetaMask
      window.location.reload()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum?.removeListener('chainChanged', handleChainChanged)
    }
  }, [disconnectWallet])

  return (
    <WalletContext.Provider value={{
      address, isConnected, isConnecting,
      chainId, balance, connectWallet, disconnectWallet, error,
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)