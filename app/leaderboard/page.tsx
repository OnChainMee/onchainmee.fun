'use client'

import { Navbar } from '@/components/Navbar'
import { useState } from 'react'

type LeaderboardEntry = {
  rank: number
  address: string
  score: number
  games: number
}

const weeklyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', score: 125000, games: 234 },
  { rank: 2, address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', score: 98000, games: 189 },
  { rank: 3, address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM', score: 87500, games: 201 },
  { rank: 4, address: '3xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', score: 72000, games: 156 },
  { rank: 5, address: '8WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', score: 65000, games: 178 },
  { rank: 6, address: '2FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM', score: 58000, games: 145 },
  { rank: 7, address: '4xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', score: 52000, games: 132 },
  { rank: 8, address: '6WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', score: 48000, games: 167 },
  { rank: 9, address: '1FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM', score: 45000, games: 123 },
  { rank: 10, address: '9xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', score: 42000, games: 198 },
]

const allTimeLeaderboard: LeaderboardEntry[] = [
  { rank: 1, address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', score: 1250000, games: 2340 },
  { rank: 2, address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', score: 980000, games: 1890 },
  { rank: 3, address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM', score: 875000, games: 2010 },
  { rank: 4, address: '3xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', score: 720000, games: 1560 },
  { rank: 5, address: '8WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', score: 650000, games: 1780 },
  { rank: 6, address: '2FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM', score: 580000, games: 1450 },
  { rank: 7, address: '4xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', score: 520000, games: 1320 },
  { rank: 8, address: '6WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', score: 480000, games: 1670 },
  { rank: 9, address: '1FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM', score: 450000, games: 1230 },
  { rank: 10, address: '9xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', score: 420000, games: 1980 },
]

const broPointsLeaderboard: LeaderboardEntry[] = [
  { rank: 1, address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', score: 50000, games: 234 },
  { rank: 2, address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', score: 45000, games: 189 },
  { rank: 3, address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM', score: 40000, games: 201 },
  { rank: 4, address: '3xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', score: 35000, games: 156 },
  { rank: 5, address: '8WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', score: 30000, games: 178 },
  { rank: 6, address: '2FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM', score: 28000, games: 145 },
  { rank: 7, address: '4xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', score: 25000, games: 132 },
  { rank: 8, address: '6WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', score: 22000, games: 167 },
  { rank: 9, address: '1FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM', score: 20000, games: 123 },
  { rank: 10, address: '9xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', score: 18000, games: 198 },
]

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'alltime' | 'bro'>('weekly')

  const getLeaderboard = () => {
    switch (activeTab) {
      case 'weekly':
        return weeklyLeaderboard
      case 'alltime':
        return allTimeLeaderboard
      case 'bro':
        return broPointsLeaderboard
      default:
        return weeklyLeaderboard
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'weekly'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setActiveTab('alltime')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'alltime'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setActiveTab('bro')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'bro'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Bro Point
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Address</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Score</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Games</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getLeaderboard().map((entry) => (
                  <tr key={entry.rank} className="hover:bg-gray-100 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            entry.rank === 1
                              ? 'bg-yellow-400 text-yellow-900'
                              : entry.rank === 2
                              ? 'bg-gray-300 text-gray-700'
                              : entry.rank === 3
                              ? 'bg-orange-300 text-orange-800'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {entry.rank}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">
                        {entry.address.slice(0, 8)}...{entry.address.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-semibold">
                        {entry.score.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm text-gray-600">
                        {entry.games.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Button */}
        <div className="mt-6 flex justify-center">
          <button className="px-6 py-2 text-sm text-gray-600 hover:text-black flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Leaderboard info</span>
          </button>
        </div>
      </div>
    </main>
  )
}

