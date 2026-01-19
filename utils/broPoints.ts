/**
 * Bro Points System
 * Earn points based on USD value of bet
 */

// Mock SOL to USD price (in production, fetch from API)
const SOL_TO_USD = 100 // Example: $100 per SOL

/**
 * Calculate Bro Points earned from a bet
 * Formula: Points = Bet Amount (in SOL) * SOL Price (USD)
 */
export function calculateBroPoints(betAmountSOL: number, solPriceUSD: number = SOL_TO_USD): number {
  const betValueUSD = betAmountSOL * solPriceUSD
  return Math.floor(betValueUSD) // 1 point per USD
}

/**
 * Calculate Bro Points for a game session
 * Points are earned whether you win or lose
 */
export function calculateGameBroPoints(betAmountSOL: number): number {
  return calculateBroPoints(betAmountSOL)
}

