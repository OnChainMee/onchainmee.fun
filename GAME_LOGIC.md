# Bro.fun Game Logic Implementation

This document describes the complete implementation of the bro.fun cup selection game logic for Solana.

## Core Game Mechanics

### 1. Cup Selection Game
- Players bet SOL and play through multiple rounds
- Each round has 2-7 cups, with one hidden "death cup"
- Players select one cup per round
- If they survive, the multiplier increases
- If they hit the death cup, they lose their bet
- Players can cash out at any time to lock in their multiplier

### 2. Multiplier Calculation

#### Base Multiplier
Formula: `BaseMult = 1 / (1 - (1 / numCups))`

Example: Round with 2 cups = `1 / (1 - 0.5) = 2.0x`

#### Cumulative Multiplier
Multiplies all previous rounds' base multipliers:
```
CumMult Round N = BaseMultRound1 * BaseMultRound2 * ... * BaseMultRoundN
```

#### Total Multiplier (with House Edge)
Applies 95% RTP (Return to Player):
```
TotalMult = CumMult * 0.95
```

### 3. Provably Fair System

#### Seed Generation
- Uses Web Crypto API to generate a secure 64-character hex seed
- Seed is generated before the game starts

#### Death Cup Generation
- Uses SHA-256 hashing: `hash(seed + "-row" + rowIndex)`
- Converts first 8 hex characters to number
- Uses modulo to determine death cup position: `hash % numCups`

#### Commitment Hash
- Creates hash of: `{ version, rows, seed }`
- Stored before game starts
- Cannot be changed after game creation
- Used for verification after game ends

### 4. Bro Points System
- Earn points based on USD value of bet
- Formula: `Points = Bet Amount (SOL) * SOL Price (USD)`
- Points earned whether you win or lose
- 1 point per USD value

### 5. Pot Limits
- **Max Bet**: 1% of pot size
- **Max Payout**: 5% of pot size
- Players must cash out before reaching max payout limit

### 6. Referral System
- Earn 5% of profit on referrals' bets for life
- Minimum payout: 50 SOL
- Unique referral link per wallet

## File Structure

### Utilities (`utils/`)
- `provablyFair.ts` - Seed generation, death cup calculation, commitment hashing
- `multiplier.ts` - Base, cumulative, and total multiplier calculations
- `gameState.ts` - Game session management and state transitions
- `broPoints.ts` - Bro Points calculation
- `potLimits.ts` - Max bet/payout validation

### Components (`components/`)
- `GameArea.tsx` - Main game interface with cup selection
- `WalletBalance.tsx` - Deposit/withdrawal functionality
- `GameVerifier.tsx` - Provably fair game verification tool

### Pages (`app/`)
- `page.tsx` - Main game page
- `stats/page.tsx` - Player statistics and game verifier
- `leaderboard/page.tsx` - Leaderboards (Weekly, All Time, Bro Points)

## Game Flow

1. **Pre-Game**
   - Player sets bet amount
   - Player can shuffle round configuration (2-7 cups per round)
   - System generates seed and calculates death cups
   - Commitment hash is created and stored

2. **During Game**
   - Player selects one cup per round
   - If death cup: Game ends, bet lost
   - If safe cup: Multiplier increases, next round begins
   - Player can cash out at any time

3. **Post-Game**
   - If cashed out: Payout = bet * multiplier
   - If busted: Payout = 0
   - Bro Points earned regardless of outcome
   - Game data available for verification

4. **Verification**
   - Player can verify game fairness using commitment hash
   - Verifier checks that hash matches seed and configuration
   - Proves game was fair and couldn't be manipulated

## Solana Integration Points

### Current Implementation (Mock)
- Bet amounts in SOL
- Wallet connection via Solana Wallet Adapter
- Balance display from wallet

### Future Smart Contract Integration
- Deposit SOL to in-game wallet
- Withdraw winnings to wallet
- On-chain game state storage
- On-chain commitment hash storage
- Automatic payout distribution
- Referral tracking on-chain
- Bro Points as SPL token or on-chain state

## Security Considerations

1. **Provably Fair**: All randomness is deterministic from seed
2. **Commitment Hash**: Prevents manipulation of game outcomes
3. **Pot Limits**: Protects against large single-round losses
4. **Validation**: Bet and payout limits enforced before game start

## Testing

To test the game:
1. Connect Solana wallet (Phantom, Solflare, etc.)
2. Set bet amount (default: 0.1 SOL)
3. Optionally shuffle round configuration
4. Click "Place Bet & Start Game"
5. Select cups each round
6. Cash out or continue until busted
7. Verify game fairness in Stats page

## Notes

- Currently uses mock pot size (10,000 SOL)
- SOL to USD conversion is mocked (currently $100/SOL)
- Deposit/withdrawal is simulated (needs smart contract integration)
- Game history stored in local state (should be persisted)
- Leaderboards use mock data (needs backend integration)

