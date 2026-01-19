/**
 * Game State Management
 */

import { RoundConfig, DeathCup } from './provablyFair'
import { calculateTotalMultiplier } from './multiplier'

export interface GameSession {
  id: string
  seed: string
  commitmentHash: string
  roundConfigs: RoundConfig[]
  deathCups: DeathCup[]
  currentRound: number
  betAmount: number
  selectedCups: number[] // Cup index selected for each round
  isActive: boolean
  isBusted: boolean
  cashedOut: boolean
  finalMultiplier: number
  payout: number
  broPoints: number
  createdAt: number
}

export function createGameSession(
  seed: string,
  commitmentHash: string,
  roundConfigs: RoundConfig[],
  deathCups: DeathCup[],
  betAmount: number
): GameSession {
  return {
    id: `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    seed,
    commitmentHash,
    roundConfigs,
    deathCups,
    currentRound: 0,
    betAmount,
    selectedCups: [],
    isActive: true,
    isBusted: false,
    cashedOut: false,
    finalMultiplier: 1.0,
    payout: 0,
    broPoints: 0,
    createdAt: Date.now(),
  }
}

export function selectCup(gameSession: GameSession, cupIndex: number): GameSession {
  if (!gameSession.isActive || gameSession.isBusted || gameSession.cashedOut) {
    return gameSession
  }

  const currentDeathCup = gameSession.deathCups[gameSession.currentRound]
  
  if (cupIndex === currentDeathCup.position) {
    // Busted!
    return {
      ...gameSession,
      isActive: false,
      isBusted: true,
      finalMultiplier: 0,
      payout: 0,
    }
  }

  // Survived the round
  const newSelectedCups = [...gameSession.selectedCups, cupIndex]
  const newCurrentRound = gameSession.currentRound + 1

  // Check if game is complete (all rounds survived)
  const isComplete = newCurrentRound >= gameSession.roundConfigs.length

  if (isComplete) {
    const finalMult = calculateTotalMultiplier(gameSession.roundConfigs, gameSession.currentRound)
    return {
      ...gameSession,
      selectedCups: newSelectedCups,
      currentRound: newCurrentRound,
      isActive: false,
      finalMultiplier: finalMult,
      payout: gameSession.betAmount * finalMult,
    }
  }

  return {
    ...gameSession,
    selectedCups: newSelectedCups,
    currentRound: newCurrentRound,
  }
}

export function cashOut(gameSession: GameSession): GameSession {
  if (!gameSession.isActive || gameSession.isBusted || gameSession.cashedOut) {
    return gameSession
  }

  const multiplier = calculateTotalMultiplier(gameSession.roundConfigs, gameSession.currentRound - 1)
  const payout = gameSession.betAmount * multiplier

  return {
    ...gameSession,
    isActive: false,
    cashedOut: true,
    finalMultiplier: multiplier,
    payout,
  }
}

