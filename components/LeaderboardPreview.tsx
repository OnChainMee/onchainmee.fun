'use client'

import React, { useState } from 'react'
import Link from 'next/link'

type LeaderboardEntry = {
  rank: number
  address: string
  score: number
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', score: 125000 },
  { rank: 2, address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', score: 98000 },
  { rank: 3, address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM', score: 87500 },
  { rank: 4, address: '3xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', score: 72000 },
  { rank: 5, address: '8WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', score: 65000 },
]

export function LeaderboardPreview() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'alltime' | 'bro'>('weekly')

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <Link href="/leaderboard" className="text-sm text-gray-600 hover:text-black">
          View All →
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'weekly'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setActiveTab('alltime')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'alltime'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setActiveTab('bro')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'bro'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          Bro Point
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {mockLeaderboard.map((entry) => (
          <div
            key={entry.rank}
            className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  entry.rank === 1
                    ? 'bg-yellow-400 text-yellow-900'
                    : entry.rank === 2
                    ? 'bg-gray-300 text-gray-700'
                    : entry.rank === 3
                    ? 'bg-orange-300 text-orange-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {entry.rank}
              </div>
              <div>
                <div className="text-sm font-medium">
                  {entry.address.slice(0, 4)}...{entry.address.slice(-4)}
                </div>
              </div>
            </div>
            <div className="text-sm font-semibold">
              {entry.score.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Info Button */}
      <button className="mt-4 w-full py-2 text-sm text-gray-600 hover:text-black flex items-center justify-center space-x-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Leaderboard info</span>
      </button>
    </div>
  )
}

