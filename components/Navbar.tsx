'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export function Navbar() {
  const { publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number>(0)

  useEffect(() => {
    if (publicKey && connection) {
      connection.getBalance(publicKey).then((bal) => {
        setBalance(bal / LAMPORTS_PER_SOL)
      })
    } else {
      setBalance(0)
    }
  }, [publicKey, connection])

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu, Social, Support */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <a href="https://twitter.com/OnChainMee" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded-lg">Support</button>
            <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded-lg">Referral</button>
          </div>

          {/* Center - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded"></div>
              <div className="text-2xl font-bold">OnChainMee.fun</div>
            </Link>
          </div>

          {/* Right side - Wallet info */}
          <div className="flex items-center space-x-4">
            <a href="https://twitter.com/OnChainMee" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {publicKey ? (
              <>
                <button className="px-3 py-1 text-sm bg-gray-100 rounded-lg">
                  {balance.toFixed(2)} SOL
                </button>
                <button
                  onClick={() => disconnect()}
                  className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                </button>
              </>
            ) : (
              <button
                onClick={() => setVisible(true)}
                className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8">
            <Link href="/stats" className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-black border-b-2 border-transparent hover:border-black">
              Stats
            </Link>
            <Link href="/" className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-black border-b-2 border-transparent hover:border-black">
              Play
            </Link>
            <Link href="/leaderboard" className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-black border-b-2 border-transparent hover:border-black">
              Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

