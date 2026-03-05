'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
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
    setIsConnecting(false) // ← always reset spinner too
  }, [])

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask is not installed. Please install it from metamask.io')
      return
    }

    // Prevent double-click
    if (isConnecting) return

    setIsConnecting(true)
    setError(null)

    // Safety timeout — if MetaMask doesn't respond in 60s, reset
    const timeout = setTimeout(() => {
      setIsConnecting(false)
      setError('Connection timed out. Please try again.')
    }, 60000)

    try {
      // Always prompt MetaMask to show account selection
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      })

      const accounts: string[] = await window.ethereum.request({
        method: 'eth_accounts',
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.')
      }

      const userAddress = accounts[0]

      const rawChainId: string = await window.ethereum.request({
        method: 'eth_chainId',
      })
      const parsedChainId = parseInt(rawChainId, 16)

      const rawBalance: string = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [userAddress, 'latest'],
      })
      const balanceInEth = (parseInt(rawBalance, 16) / 1e18).toFixed(4)

      setAddress(userAddress)
      setChainId(parsedChainId)
      setBalance(balanceInEth)
      setIsConnected(true)

    } catch (err: any) {
      // User closed MetaMask or rejected — reset silently
      if (err?.code === 4001 || err?.code === -32603) {
        setError(null) // don't show error for user cancel
      } else if (err?.code === -32002) {
        setError('MetaMask is already open. Please check your MetaMask extension.')
      } else {
        setError(err?.message ?? 'Failed to connect wallet')
      }
      setAddress(null)
      setIsConnected(false)
      setChainId(null)
      setBalance(null)
    } finally {
      // ALWAYS reset connecting state no matter what happened
      clearTimeout(timeout)
      setIsConnecting(false)
    }
  }, [isConnecting])

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