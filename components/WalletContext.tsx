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
  }, [])

  const connectWallet = useCallback(async () => {
    // Make sure MetaMask is installed
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask is not installed. Please install it from metamask.io')
      return
    }

    // Make sure it is actually MetaMask and not another wallet
    if (!window.ethereum.isMetaMask) {
      setError('Please use MetaMask to connect')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Force MetaMask to show the account selection popup
      // wallet_requestPermissions always prompts the user to pick an account
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      })

      // After permission granted, get the selected accounts
      const accounts: string[] = await window.ethereum.request({
        method: 'eth_accounts',
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.')
      }

      const userAddress = accounts[0]

      // Get chain ID
      const rawChainId: string = await window.ethereum.request({
        method: 'eth_chainId',
      })
      const parsedChainId = parseInt(rawChainId, 16)

      // Get ETH balance
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
      if (err?.code === 4001) {
        setError('Connection rejected. Please approve in MetaMask.')
      } else if (err?.code === -32002) {
        setError('MetaMask is already processing a request. Please open MetaMask.')
      } else {
        setError(err?.message ?? 'Failed to connect wallet')
      }
      disconnectWallet()
    } finally {
      setIsConnecting(false)
    }
  }, [disconnectWallet])

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        chainId,
        balance,
        connectWallet,
        disconnectWallet,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)