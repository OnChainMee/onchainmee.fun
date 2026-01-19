/**
 * Multiplier Calculation Logic
 * Based on bro.fun's multiplier system
 */

export interface RoundConfig {
  cups: number
}

const HOUSE_EDGE = 0.95 // 95% RTP

/**
 * Calculate base multiplier for a round
 * Formula: BaseMult = 1 / (1 - (1 / numCups))
 */
export function calculateBaseMultiplier(numCups: number): number {
  if (numCups <= 1) return 1.0
  return 1 / (1 - (1 / numCups))
}

/**
 * Calculate cumulative multiplier up to a specific round
 */
export function calculateCumulativeMultiplier(roundConfigs: RoundConfig[], upToRound: number): number {
  let cumulative = 1.0

  for (let i = 0; i <= upToRound && i < roundConfigs.length; i++) {
    const baseMult = calculateBaseMultiplier(roundConfigs[i].cups)
    cumulative *= baseMult
  }

  return cumulative
}

/**
 * Calculate total multiplier for a round (with house edge applied)
 */
export function calculateTotalMultiplier(roundConfigs: RoundConfig[], roundIndex: number): number {
  const cumulativeMult = calculateCumulativeMultiplier(roundConfigs, roundIndex)
  return cumulativeMult * HOUSE_EDGE
}

/**
 * Generate random round configuration
 * Each round has between 2 and 7 cups
 */
export function generateRandomRoundConfigs(numRounds: number = 10): RoundConfig[] {
  const configs: RoundConfig[] = []
  
  for (let i = 0; i < numRounds; i++) {
    const cups = Math.floor(Math.random() * 6) + 2 // 2 to 7 cups
    configs.push({ cups })
  }
  
  return configs
}

