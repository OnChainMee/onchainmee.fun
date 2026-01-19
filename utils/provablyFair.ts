/**
 * Provably Fair Game Logic
 * Based on bro.fun's provably fair system
 */

export interface RoundConfig {
  cups: number
}

export interface DeathCup {
  row: number
  position: number
  totalCups: number
}

export interface GameData {
  version: string
  rows: RoundConfig[]
  seed: string
}

/**
 * Generate a random 64-character hex string seed
 * Uses Web Crypto API for secure random number generation
 */
export function generateGameSeed(): string {
  if (typeof window === 'undefined' || !window.crypto?.getRandomValues) {
    // Fallback for Node.js environments (shouldn't happen in browser)
    throw new Error('Crypto API not available')
  }
  
  const array = new Uint8Array(32)
  window.crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Generate SHA-256 hash (browser-compatible)
 * Uses Web Crypto API available in modern browsers
 */
async function sha256(message: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    throw new Error('Web Crypto API not available')
  }
  
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Get death cup index for a specific round
 */
async function getDeathCupIndex(seed: string, rowIndex: number, totalCups: number): Promise<number> {
  const hashSource = `${seed}-row${rowIndex}`
  const hash = await sha256(hashSource)
  const numericHash = parseInt(hash.slice(0, 8), 16)
  return numericHash % totalCups
}

/**
 * Generate all death cup locations for a game
 */
export async function generateAllDeathCups(seed: string, rowConfigs: RoundConfig[]): Promise<DeathCup[]> {
  const deathCups: DeathCup[] = []

  for (let rowIndex = 0; rowIndex < rowConfigs.length; rowIndex++) {
    const totalCups = rowConfigs[rowIndex].cups
    const deathCupIndex = await getDeathCupIndex(seed, rowIndex, totalCups)

    deathCups.push({
      row: rowIndex,
      position: deathCupIndex,
      totalCups: totalCups,
    })
  }

  return deathCups
}

/**
 * Create commitment hash for provably fair verification
 */
export async function createCommitmentHash(version: string, rows: RoundConfig[], seed: string): Promise<string> {
  const gameData: GameData = {
    version,
    rows,
    seed,
  }

  const gameDataString = JSON.stringify(gameData)
  const hash = await sha256(gameDataString)
  return '0x' + hash
}

/**
 * Verify a game's commitment hash
 */
export async function verifyGame(
  commitmentHash: string,
  version: string,
  rows: RoundConfig[],
  seed: string
): Promise<boolean> {
  const calculatedHash = await createCommitmentHash(version, rows, seed)
  return calculatedHash.toLowerCase() === commitmentHash.toLowerCase()
}

