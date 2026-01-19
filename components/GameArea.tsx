'use client'

import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import toast from 'react-hot-toast'
import { generateGameSeed, generateAllDeathCups, createCommitmentHash } from '@/utils/provablyFair'
import { generateRandomRoundConfigs, calculateTotalMultiplier } from '@/utils/multiplier'
import { createGameSession, selectCup, cashOut, GameSession } from '@/utils/gameState'
import { calculateGameBroPoints } from '@/utils/broPoints'
import { validateBet, validatePayout, getMaxBet, getMaxPayout } from '@/utils/potLimits'

const VERSION = 'v1'
const DEFAULT_BET_AMOUNT = 0.1 // SOL

export function GameArea() {
  const { publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const [isMuted, setIsMuted] = useState(false)
  const [betAmount, setBetAmount] = useState(DEFAULT_BET_AMOUNT)
  const [roundConfigs, setRoundConfigs] = useState<Array<{ cups: number }> | null>(null)
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [broPoints, setBroPoints] = useState(0)
  const [gameHistory, setGameHistory] = useState<GameSession[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 }) // Percentage position
  const [isHoveringGameArea, setIsHoveringGameArea] = useState(false)

  // Initialize round configs on client side only to avoid hydration mismatch
  useEffect(() => {
    if (roundConfigs === null) {
      setRoundConfigs(generateRandomRoundConfigs(10))
    }
  }, [roundConfigs])

  // Handle mouse movement over game area
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameSession?.isActive) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    // Constrain ball movement to reasonable bounds (keep it near bottom but allow some movement)
    const constrainedX = Math.max(10, Math.min(90, x))
    const constrainedY = Math.max(60, Math.min(90, y)) // Keep ball in lower portion
    
    setMousePosition({ x: constrainedX, y: constrainedY })
  }

  // Initialize game when bet is placed
  const startGame = async () => {
    if (!publicKey) {
      setVisible(true)
      return
    }

    if (!roundConfigs) {
      toast.error('Round configuration not ready')
      return
    }

    // Validate bet
    const betValidation = validateBet(betAmount)
    if (!betValidation.valid) {
      toast.error(betValidation.reason || 'Invalid bet amount')
      return
    }

    try {
      // Generate game seed and death cups
      const seed = generateGameSeed()
      const deathCups = await generateAllDeathCups(seed, roundConfigs)
      const commitmentHash = await createCommitmentHash(VERSION, roundConfigs, seed)

      // Create game session
      const session = createGameSession(seed, commitmentHash, roundConfigs, deathCups, betAmount)
      setGameSession(session)

      toast.success(`Game started! Commitment: ${commitmentHash.slice(0, 16)}...`)
    } catch (error) {
      toast.error('Failed to start game')
      console.error(error)
    }
  }

  // Handle cup selection
  const handleCupSelect = (cupIndex: number) => {
    if (!gameSession || !gameSession.isActive) return

    const updatedSession = selectCup(gameSession, cupIndex)

    if (updatedSession.isBusted) {
      toast.error(`💥 Busted! Death cup was at position ${cupIndex + 1}`)
      const points = calculateGameBroPoints(betAmount)
      setBroPoints((prev) => prev + points)
      setGameHistory((prev) => [updatedSession, ...prev].slice(0, 10))
    } else if (!updatedSession.isActive) {
      // Completed all rounds
      toast.success(`🎉 Completed all rounds! Multiplier: ${updatedSession.finalMultiplier.toFixed(2)}x`)
      const points = calculateGameBroPoints(betAmount)
      setBroPoints((prev) => prev + points)
      setGameHistory((prev) => [updatedSession, ...prev].slice(0, 10))
    } else {
      // Survived round
      if (roundConfigs) {
        const currentMult = calculateTotalMultiplier(roundConfigs, updatedSession.currentRound - 1)
        toast.success(`✅ Survived! Current multiplier: ${currentMult.toFixed(2)}x`)
      }
    }

    setGameSession(updatedSession)
  }

  // Handle cash out
  const handleCashOut = () => {
    if (!gameSession || !gameSession.isActive || !roundConfigs) return

    const payoutValidation = validatePayout(gameSession.betAmount, calculateTotalMultiplier(roundConfigs, gameSession.currentRound - 1))
    if (!payoutValidation.valid) {
      toast.error(payoutValidation.reason || 'Cannot cash out')
      if (payoutValidation.maxMultiplier) {
        toast(`Max multiplier: ${payoutValidation.maxMultiplier.toFixed(2)}x`, { icon: 'ℹ️' })
      }
      return
    }

    const updatedSession = cashOut(gameSession)
    const points = calculateGameBroPoints(betAmount)
    setBroPoints((prev) => prev + points)
    setGameHistory((prev) => [updatedSession, ...prev].slice(0, 10))
    
    toast.success(`💰 Cashed out at ${updatedSession.finalMultiplier.toFixed(2)}x! Payout: ${updatedSession.payout.toFixed(4)} SOL`)
    setGameSession(updatedSession)
  }

  // Shuffle round configuration
  const handleShuffle = () => {
    if (gameSession?.isActive) {
      toast.error('Cannot shuffle during an active game')
      return
    }
    if (roundConfigs === null) {
      setRoundConfigs(generateRandomRoundConfigs(10))
    } else {
      setRoundConfigs(generateRandomRoundConfigs(10))
    }
    toast.success('Round configuration shuffled!')
  }

  // Reset game
  const resetGame = () => {
    setGameSession(null)
  }

  const currentMultiplier = gameSession && gameSession.isActive && roundConfigs
    ? calculateTotalMultiplier(roundConfigs, gameSession.currentRound - 1)
    : gameSession?.finalMultiplier || 1.0

  const currentRound = gameSession?.currentRound ?? 0
  const currentRoundConfig = roundConfigs ? roundConfigs[currentRound] : null
  const maxBet = getMaxBet()
  const maxPayout = getMaxPayout()

  return (
    <div className="bg-gray-50 rounded-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Play</h2>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 hover:bg-gray-200 rounded-lg"
        >
          {isMuted ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>

      {/* Bet Amount Input */}
      {!gameSession && (
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-lg p-6 mb-6 border-2 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
          
          <div className="relative z-10">
            <label className="block text-sm font-medium text-white mb-3 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]">
              Bet Amount (SOL)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="0.001"
                max={maxBet}
                step="0.001"
                value={betAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBetAmount(parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-3 bg-gray-800/50 border-2 border-blue-400/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                placeholder="0.0"
              />
              <button
                onClick={handleShuffle}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_15px_rgba(168,85,247,0.5)] font-semibold"
              >
                Shuffle
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-300 flex items-center gap-4">
              <span>Max bet: <span className="text-blue-400 font-semibold">{maxBet.toFixed(4)} SOL</span> (1% of pot)</span>
              <span>|</span>
              <span>Max payout: <span className="text-green-400 font-semibold">{maxPayout.toFixed(4)} SOL</span> (5% of pot)</span>
            </div>
          </div>
        </div>
      )}

      {/* Game Display */}
      {gameSession && gameSession.isActive && currentRoundConfig && roundConfigs && (
        <div className="relative bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-lg p-8 mb-6 overflow-hidden border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
          {/* Neon glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
          
          {/* Instruction Text */}
          <div className="text-center mb-6 relative z-10">
            <div className="inline-block px-6 py-2 bg-black border-2 border-red-500 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.8)]">
              <div className="text-white text-lg font-bold">CLICK A CUP TO SHOOT</div>
            </div>
            <div className="mt-4 text-white text-sm mb-2">Round {currentRound + 1} / {roundConfigs.length}</div>
            <div className="text-5xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
              {currentMultiplier.toFixed(2)}x
            </div>
            <div className="text-green-400 text-sm font-semibold animate-pulse">● LIVE</div>
          </div>

          {/* Game Table Surface */}
          <div 
            className="relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-lg p-8 border border-blue-400/30 shadow-inner backdrop-blur-sm cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHoveringGameArea(true)}
            onMouseLeave={() => {
              setIsHoveringGameArea(false)
              // Reset ball to center bottom when mouse leaves
              setMousePosition({ x: 50, y: 85 })
            }}
          >
            {/* White Ball - follows mouse */}
            <div 
              className="absolute w-12 h-12 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.6)] border-2 border-pink-300/50 transition-all duration-150 ease-out pointer-events-none z-20"
              style={{
                left: `${mousePosition.x}%`,
                top: `${mousePosition.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            ></div>

            {/* Cups Display - Triangular Formation */}
            <div className="flex flex-col items-center gap-3 relative z-10">
              {/* Calculate triangular formation */}
              {(() => {
                const cups = currentRoundConfig.cups
                const rows: number[] = []
                let remaining = cups
                let rowSize = Math.ceil(Math.sqrt(cups * 2))
                
                // Create triangular formation
                while (remaining > 0 && rows.length < 3) {
                  const currentRow = Math.min(rowSize, remaining)
                  rows.push(currentRow)
                  remaining -= currentRow
                  rowSize = Math.max(1, rowSize - 1)
                }
                
                let cupIndex = 0
                return rows.map((rowCups, rowIdx) => (
                  <div key={rowIdx} className="flex justify-center gap-4">
                    {Array.from({ length: rowCups }).map((_, cupInRow) => {
                      const index = cupIndex++
                      const isSelected = gameSession.selectedCups[currentRound] === index
                      const isDeathCup = gameSession.deathCups[currentRound]?.position === index
                      const isRevealed = gameSession.isBusted && isDeathCup

                      return (
                        <button
                          key={index}
                          onClick={() => handleCupSelect(index)}
                          disabled={isSelected || gameSession.isBusted}
                          className={`
                            relative w-16 h-16 rounded-b-full transition-all duration-300
                            ${isSelected
                              ? 'bg-green-500 shadow-[0_0_25px_rgba(34,197,94,0.9)] scale-110'
                              : isRevealed
                              ? 'bg-red-600 shadow-[0_0_25px_rgba(239,68,68,0.9)] animate-pulse'
                              : 'bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.6)] hover:shadow-[0_0_25px_rgba(239,68,68,0.9)] hover:scale-105'
                            }
                            ${gameSession.isBusted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            border-2 ${isSelected ? 'border-green-300' : isRevealed ? 'border-red-300' : 'border-red-400'}
                          `}
                        >
                          {/* Cup liquid effect */}
                          <div className={`absolute bottom-0 left-0 right-0 rounded-b-full ${
                            isSelected ? 'bg-green-700' : isRevealed ? 'bg-red-800' : 'bg-red-800'
                          }`} style={{ height: '60%' }}></div>
                          
                          {/* Cup number */}
                          {!isSelected && !isRevealed && (
                            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm drop-shadow-lg">
                              {index + 1}
                            </span>
                          )}
                          
                          {/* Checkmark or skull */}
                          {(isSelected || isRevealed) && (
                            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                              {isSelected ? '✓' : '💀'}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))
              })()}
            </div>
          </div>

          <div className="text-center mt-6 text-white/80 text-sm relative z-10">
            Choose one cup per round. Survive to increase your multiplier!
          </div>
        </div>
      )}

      {/* Game Result Display */}
      {gameSession && !gameSession.isActive && (
        <div className={`rounded-lg p-8 mb-6 ${gameSession.isBusted ? 'bg-red-50' : 'bg-green-50'}`}>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {gameSession.isBusted ? '💥 Busted!' : '💰 Cashed Out!'}
            </div>
            <div className="text-2xl font-semibold mb-2">
              {gameSession.finalMultiplier.toFixed(2)}x
            </div>
            <div className="text-lg">
              Payout: {gameSession.payout.toFixed(4)} SOL
            </div>
            {gameSession.commitmentHash && (
              <div className="mt-4 text-xs text-gray-600 font-mono">
                Hash: {gameSession.commitmentHash.slice(0, 16)}...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Controls */}
      <div className="space-y-4 mb-6">
        {!gameSession ? (
          <>
            {!publicKey ? (
              <>
                <button
                  onClick={() => setVisible(true)}
                  className="w-full py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                  Sign in to Play
                </button>
                <button
                  onClick={startGame}
                  className="w-full py-4 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Play Demo
                </button>
              </>
            ) : (
              <button
                onClick={startGame}
                className="w-full py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Place Bet & Start Game
              </button>
            )}
          </>
        ) : gameSession.isActive ? (
          <button
            onClick={handleCashOut}
            className="w-full py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Cash Out ({currentMultiplier.toFixed(2)}x)
          </button>
        ) : (
          <button
            onClick={resetGame}
            className="w-full py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            New Game
          </button>
        )}
        <button className="w-full py-3 text-gray-600 hover:text-black transition">
          How does this work?
        </button>
      </div>

      {/* Stats Display */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-600 text-sm">Bro Points</div>
            <div className="text-2xl font-bold">{broPoints.toLocaleString()}</div>
          </div>
          {gameSession && (
            <div>
              <div className="text-gray-600 text-sm">Current Multiplier</div>
              <div className="text-2xl font-bold">{currentMultiplier.toFixed(2)}x</div>
            </div>
          )}
        </div>
      </div>

      {/* Round Configuration Preview */}
      {!gameSession && roundConfigs && (
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Round Configuration</h3>
            <button
              onClick={handleShuffle}
              className="text-sm text-gray-600 hover:text-black"
            >
              Shuffle
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {roundConfigs.slice(0, 5).map((config, idx) => (
              <div key={idx} className="px-3 py-1 bg-gray-100 rounded text-sm">
                Round {idx + 1}: {config.cups} cups
              </div>
            ))}
            {roundConfigs.length > 5 && (
              <div className="px-3 py-1 bg-gray-100 rounded text-sm">
                +{roundConfigs.length - 5} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Games */}
      {gameHistory.length > 0 && (
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold mb-3">Recent Games</h3>
          <div className="space-y-2">
            {gameHistory.slice(0, 5).map((game, idx) => (
              <div
                key={game.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    game.isBusted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {game.isBusted ? 'Busted' : 'Won'}
                  </span>
                  <span className="text-sm">
                    {game.finalMultiplier.toFixed(2)}x
                  </span>
                </div>
                <div className="text-sm font-semibold">
                  {game.payout.toFixed(4)} SOL
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
