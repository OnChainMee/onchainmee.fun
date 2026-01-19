/**
 * Pot Limits System
 * Max bet: 1% of pot
 * Max payout: 5% of pot
 */

// Mock pot size (in production, fetch from smart contract)
const MOCK_POT_SIZE_SOL = 10000 // Example: 10,000 SOL

export function getPotSize(): number {
  // In production, fetch from smart contract
  return MOCK_POT_SIZE_SOL
}

export function getMaxBet(): number {
  const potSize = getPotSize()
  return potSize * 0.01 // 1% of pot
}

export function getMaxPayout(): number {
  const potSize = getPotSize()
  return potSize * 0.05 // 5% of pot
}

export function validateBet(betAmount: number): { valid: boolean; reason?: string } {
  const maxBet = getMaxBet()
  
  if (betAmount <= 0) {
    return { valid: false, reason: 'Bet amount must be greater than 0' }
  }
  
  if (betAmount > maxBet) {
    return { valid: false, reason: `Bet exceeds maximum of ${maxBet.toFixed(4)} SOL (1% of pot)` }
  }
  
  return { valid: true }
}

export function validatePayout(betAmount: number, multiplier: number): { valid: boolean; reason?: string; maxMultiplier?: number } {
  const maxPayout = getMaxPayout()
  const payout = betAmount * multiplier
  
  if (payout > maxPayout) {
    const maxMultiplier = maxPayout / betAmount
    return {
      valid: false,
      reason: `Payout would exceed maximum of ${maxPayout.toFixed(4)} SOL (5% of pot). Please cash out before ${maxMultiplier.toFixed(2)}x`,
      maxMultiplier,
    }
  }
  
  return { valid: true }
}

