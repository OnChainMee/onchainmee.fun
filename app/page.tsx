'use client'

import { Navbar } from '@/components/Navbar'
import { GameArea } from '@/components/GameArea'
import { LeaderboardPreview } from '@/components/LeaderboardPreview'
import { WalletBalance } from '@/components/WalletBalance'
import { useWallet } from '@solana/wallet-adapter-react'

export default function Home() {
  const { publicKey } = useWallet()

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Area - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {publicKey && (
              <WalletBalance />
            )}
            <GameArea />
          </div>

          {/* Leaderboard Preview - Takes 1 column */}
          <div className="lg:col-span-1">
            <LeaderboardPreview />
          </div>
        </div>
      </div>
    </main>
  )
}

