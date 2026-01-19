# 🎮 OnChainMee.fun

A fully decentralized, provably fair gaming platform built on Solana blockchain. Experience the thrill of cup selection games with transparent, verifiable outcomes and earn rewards through gameplay.

![Solana](https://img.shields.io/badge/Solana-14F46B?style=for-the-badge&logo=solana&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Game Mechanics](#game-mechanics)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Game Rules](#game-rules)
- [Provably Fair System](#provably-fair-system)
- [Smart Contract Integration](#smart-contract-integration)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**OnChainMee.fun** is a Solana-based gaming platform that brings the excitement of cup selection games to the blockchain. Built with transparency and fairness at its core, every game outcome can be mathematically verified, ensuring players that the games are truly fair and cannot be manipulated.

### Key Highlights

- 🎲 **Provably Fair Gaming** - Every game uses cryptographic proofs for transparency
- 💰 **Solana Native** - Built on Solana for fast, low-cost transactions
- 🎨 **Immersive UI** - Dark neon-themed interface with smooth animations
- 📊 **Leaderboards** - Compete with players worldwide
- 🏆 **Bro Points System** - Earn rewards through gameplay
- 🔗 **Referral Program** - Earn commissions from referrals

## ✨ Features

### Core Gameplay

- **Cup Selection Game**
  - Choose cups across multiple rounds
  - Each round has a hidden "death cup"
  - Survive rounds to increase your multiplier
  - Cash out anytime to secure winnings
  - Risk vs reward mechanics

- **Dynamic Multipliers**
  - Base multiplier calculated from cup count
  - Cumulative multipliers across rounds
  - 95% RTP (Return to Player)
  - Real-time multiplier display

- **Round Configuration**
  - Shuffle button to randomize cup counts
  - 2-7 cups per round
  - Configurable round structure

### Wallet Integration

- **Multi-Wallet Support**
  - Phantom
  - Solflare
  - Any Solana Wallet Adapter compatible wallet

- **Balance Management**
  - View SOL balance
  - Deposit to in-game wallet
  - Withdraw winnings
  - Transaction history

### Social Features

- **Leaderboards**
  - Weekly rankings
  - All-time champions
  - Bro Points leaderboard
  - Real-time updates

- **Stats Tracking**
  - Total games played
  - Win/loss ratio
  - Highest multiplier achieved
  - Average multiplier
  - Bro Points earned

- **Referral System**
  - Unique referral links
  - 5% commission on referrals' profits
  - Lifetime earnings
  - Minimum payout: 50 SOL

### Provably Fair System

- **Transparent Gaming**
  - Commitment hash stored before game starts
  - Seed revealed after game completion
  - Mathematical verification tool
  - SHA-256 cryptographic hashing

- **Game Verification**
  - Verify any past game
  - Check commitment hash integrity
  - Confirm death cup positions
  - Ensure fairness

## 🎮 Game Mechanics

### How to Play

1. **Connect Wallet** - Link your Solana wallet (Phantom, Solflare, etc.)
2. **Set Bet Amount** - Choose your bet in SOL (max 1% of pot)
3. **Shuffle Rounds** (Optional) - Randomize cup configurations
4. **Start Game** - Place bet and begin
5. **Select Cups** - Click a cup each round to "shoot"
6. **Survive or Cash Out** - Avoid death cups or cash out early
7. **Earn Rewards** - Win SOL and Bro Points

### Multiplier Calculation

#### Base Multiplier
```
BaseMult = 1 / (1 - (1 / numCups))
```

Example: Round with 2 cups = `1 / (1 - 0.5) = 2.0x`

#### Cumulative Multiplier
Multiplies all previous rounds' base multipliers:
```
CumMult Round N = BaseMultRound1 × BaseMultRound2 × ... × BaseMultRoundN
```

#### Total Multiplier (with House Edge)
Applies 95% RTP:
```
TotalMult = CumMult × 0.95
```

### Pot Limits

- **Max Bet**: 1% of pot size
- **Max Payout**: 5% of pot size
- Players must cash out before reaching max payout limit

### Bro Points

- Earn points based on USD value of bet
- Formula: `Points = Bet Amount (SOL) × SOL Price (USD)`
- Points earned whether you win or lose
- 1 point per USD value

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git
- A Solana wallet (Phantom recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OnChainMee/onchainmee.fun
   cd onchainmee.fun
   ```

2. **Initialize git repository** (required for some dependencies)
   ```bash
   git init
   ```

3. **Install dependencies**
   ```bash
   npm install --ignore-scripts
   ```
   > **Note:** The `--ignore-scripts` flag is needed on Windows to avoid issues with some dependency setup scripts.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
onchainmee.fun/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with wallet provider
│   ├── page.tsx           # Home page with game
│   ├── stats/             # Stats page
│   │   └── page.tsx
│   ├── leaderboard/        # Leaderboard page
│   │   └── page.tsx
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── GameArea.tsx       # Main game component
│   ├── Navbar.tsx         # Navigation bar
│   ├── WalletBalance.tsx  # Wallet balance & deposit/withdraw
│   ├── WalletProvider.tsx # Solana wallet provider
│   ├── GameVerifier.tsx   # Provably fair verifier
│   └── LeaderboardPreview.tsx
├── utils/                  # Utility functions
│   ├── provablyFair.ts    # Provably fair logic
│   ├── multiplier.ts      # Multiplier calculations
│   ├── gameState.ts       # Game state management
│   ├── broPoints.ts       # Bro Points system
│   └── potLimits.ts      # Pot limit validation
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Blockchain
- **Solana Web3.js** - Solana JavaScript SDK
- **@solana/wallet-adapter-react** - Wallet integration
- **@solana/wallet-adapter-react-ui** - Wallet UI components

### Utilities
- **react-hot-toast** - Toast notifications
- **Web Crypto API** - Cryptographic functions for provably fair

## 🎲 Game Rules

### Basic Rules

1. **Betting**
   - Minimum bet: 0.001 SOL
   - Maximum bet: 1% of pot size
   - Bet amount determines potential payout

2. **Rounds**
   - Each round has 2-7 cups
   - One cup per round is the "death cup"
   - Select one cup per round

3. **Winning**
   - Survive all rounds: Maximum multiplier
   - Cash out early: Lock in current multiplier
   - Hit death cup: Lose bet

4. **Payouts**
   - Payout = Bet Amount × Multiplier
   - Maximum payout: 5% of pot size
   - Automatic SOL transfer on cash out

### Strategy Tips

- **Risk Management**: Cash out early for guaranteed wins
- **Multiplier Growth**: Survive more rounds for higher multipliers
- **Round Configuration**: Shuffle for different risk/reward profiles
- **Pot Limits**: Be aware of max payout constraints

## 🔐 Provably Fair System

### How It Works

1. **Game Creation**
   - Random seed generated using Web Crypto API
   - Death cup positions calculated from seed
   - Commitment hash created (SHA-256)
   - Hash stored before game starts

2. **Gameplay**
   - Player selects cups
   - Death cups already predetermined
   - Cannot be changed after commitment

3. **Verification**
   - Seed revealed after game
   - Players can verify commitment hash
   - Confirm death cup positions
   - Mathematical proof of fairness

### Verification Process

1. Record commitment hash when game starts
2. After game, go to Stats page
3. Click "Verify" button
4. Enter game data (or auto-filled)
5. Verify hash matches seed and configuration

### Cryptographic Details

- **Hash Algorithm**: SHA-256
- **Seed Generation**: 64-character hex string (32 bytes)
- **Death Cup Calculation**: `hash(seed + "-row" + rowIndex) % numCups`
- **Commitment**: `SHA-256({ version, rows, seed })`

## 🔗 Smart Contract Integration

### Current Status

The platform currently uses mock implementations for:
- Deposit/withdrawal
- Pot size tracking
- Game state persistence
- Leaderboard data

### Planned Integration

Future Solana program (smart contract) features:

- **Game State Storage**
  - On-chain commitment hash storage
  - Game session records
  - Player statistics

- **Token Management**
  - SOL deposit/withdrawal
  - Automatic payouts
  - Fee collection

- **Referral System**
  - On-chain referral tracking
  - Automatic commission distribution
  - Referral link validation

- **Leaderboards**
  - On-chain score storage
  - Real-time rankings
  - Historical data

- **Bro Points**
  - SPL token or on-chain state
  - Point accumulation
  - Reward distribution

### Smart Contract Architecture

```
Program Structure:
├── Game Module
│   ├── Create Game
│   ├── Select Cup
│   ├── Cash Out
│   └── Verify Game
├── Wallet Module
│   ├── Deposit
│   ├── Withdraw
│   └── Balance Query
├── Referral Module
│   ├── Register Referral
│   ├── Track Earnings
│   └── Withdraw Commissions
└── Leaderboard Module
    ├── Update Score
    ├── Get Rankings
    └── Historical Data
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add comments for complex logic

### Areas for Contribution

- Smart contract development
- UI/UX improvements
- Game mechanics enhancements
- Documentation
- Testing
- Bug fixes

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by bro.fun gaming platform
- Built on Solana blockchain
- Uses Solana Wallet Adapter for wallet integration

## 📞 Support

For support, questions, or suggestions:
- Open an issue on GitHub
- Check the documentation
- Review the game logic guide (`GAME_LOGIC.md`)

## 🔮 Roadmap

### Phase 1: Core Features ✅
- [x] Cup selection game
- [x] Provably fair system
- [x] Wallet integration
- [x] Basic UI

### Phase 2: Smart Contracts 🚧
- [ ] Solana program development
- [ ] On-chain game state
- [ ] Deposit/withdrawal contracts
- [ ] Referral system on-chain

### Phase 3: Enhanced Features 📋
- [ ] Multiple game modes
- [ ] NFT rewards
- [ ] Tournament system
- [ ] Mobile app

### Phase 4: Scaling 🌐
- [ ] Mainnet deployment
- [ ] Performance optimization
- [ ] Advanced analytics
- [ ] Community features

---

**Built with ❤️ on Solana**

*OnChainMee.fun - Where gaming meets blockchain transparency*
