'use client'

import { Navbar } from '@/components/Navbar'
import { useWallet } from '@solana/wallet-adapter-react'
import { GameVerifier } from '@/components/GameVerifier'
import { useState } from 'react'

export default function StatsPage() {
  const { publicKey } = useWallet()
  const [showVerifier, setShowVerifier] = useState(false)

  const stats = {
    totalGames: 127,
    totalWins: 89,
    totalLosses: 38,
    winRate: 70.1,
    highestMultiplier: 8.45,
    totalPoints: 125000,
    averageMultiplier: 2.34,
    referralCount: 12,
    referralEarnings: 2500,
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Stats</h1>

        {!publicKey ? (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-gray-600 mb-4">Connect your wallet to view your stats</p>
            <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Games */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-gray-600 text-sm mb-2">Total Games</div>
              <div className="text-3xl font-bold">{stats.totalGames}</div>
            </div>

            {/* Win Rate */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-gray-600 text-sm mb-2">Win Rate</div>
              <div className="text-3xl font-bold">{stats.winRate}%</div>
            </div>

            {/* Total Points */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-gray-600 text-sm mb-2">Total Points</div>
              <div className="text-3xl font-bold">{stats.totalPoints.toLocaleString()}</div>
            </div>

            {/* Wins */}
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-green-600 text-sm mb-2">Wins</div>
              <div className="text-3xl font-bold text-green-800">{stats.totalWins}</div>
            </div>

            {/* Losses */}
            <div className="bg-red-50 rounded-lg p-6">
              <div className="text-red-600 text-sm mb-2">Losses</div>
              <div className="text-3xl font-bold text-red-800">{stats.totalLosses}</div>
            </div>

            {/* Highest Multiplier */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-gray-600 text-sm mb-2">Highest Multiplier</div>
              <div className="text-3xl font-bold">{stats.highestMultiplier}x</div>
            </div>

            {/* Average Multiplier */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-gray-600 text-sm mb-2">Average Multiplier</div>
              <div className="text-3xl font-bold">{stats.averageMultiplier}x</div>
            </div>

            {/* Referrals */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-blue-600 text-sm mb-2">Referrals</div>
              <div className="text-3xl font-bold text-blue-800">{stats.referralCount}</div>
            </div>

            {/* Referral Earnings */}
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="text-purple-600 text-sm mb-2">Referral Earnings</div>
              <div className="text-3xl font-bold text-purple-800">{stats.referralEarnings.toLocaleString()} pts</div>
            </div>
          </div>
        )}

        {/* Referral Section */}
        {publicKey && (
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Your Referral Link</h2>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                readOnly
                value={`https://bro.fun/ref/${publicKey.toString().slice(0, 8)}`}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://bro.fun/ref/${publicKey.toString().slice(0, 8)}`)
                  alert('Referral link copied!')
                }}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Share this link and earn 5% of profit on their bets for life! Minimum payout: 50 SOL
            </p>
          </div>
        )}

        {/* Game Verifier Section */}
        {publicKey && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Verify Your Games</h2>
              <button
                onClick={() => setShowVerifier(!showVerifier)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
              >
                {showVerifier ? 'Hide Verifier' : 'Show Verifier'}
              </button>
            </div>
            {showVerifier && <GameVerifier />}
          </div>
        )}
      </div>
    </main>
  )
}

