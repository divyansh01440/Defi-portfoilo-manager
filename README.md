# AutoPortfolio 🤖⬡

> Autonomous DeFi Portfolio Manager powered by Chainlink Data Streams, CRE Workflows, and Gemini AI

Built for the **Chainlink Convergence Hackathon 2026** — Track: `#cre-ai`

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Chainlink](https://img.shields.io/badge/Chainlink-Data%20Streams-375BD2?logo=chainlink)](https://chain.link)
[![Base](https://img.shields.io/badge/Network-Base%20Sepolia-0052FF)](https://base.org)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)

---

## 🌐 Live Demo

**[autoportfolio.vercel.app](https://defi-portfoilo-manager-81uk.vercel.app/)**

---

## 📖 What is AutoPortfolio?

AutoPortfolio is a fully autonomous DeFi portfolio management system. It monitors your crypto allocations 24/7, detects drift from target weights using tamper-proof Chainlink oracle data, reasons about the best rebalancing action using Gemini AI, and executes swaps on-chain — all without manual intervention.

**The problem it solves:** Retail DeFi users lack the tools institutional traders use. Portfolios drift silently, emotions drive bad decisions, and manually rebalancing is tedious and error-prone.

**The solution:** A four-stage autonomous pipeline:

```
Chainlink Data Streams → CRE Workflow Trigger → Gemini AI Reasoning → On-chain Execution
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AutoPortfolio                        │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │   Next.js 14  │    │  MetaMask    │                  │
│  │   Frontend    │◄──►│  Wallet      │                  │
│  └──────┬───────┘    └──────────────┘                  │
│         │                                               │
│  ┌──────▼───────────────────────────────────────┐      │
│  │              API Layer (Next.js Routes)       │      │
│  │                                               │      │
│  │  /api/prices ──► Chainlink Data Streams       │      │
│  │  /api/analyze ──► Gemini 1.5 Flash AI         │      │
│  └──────┬───────────────────────────────────────┘      │
│         │                                               │
│  ┌──────▼───────────────────────────────────────┐      │
│  │           CRE Workflow Engine                 │      │
│  │                                               │      │
│  │  • Drift detection (threshold: 5%)            │      │
│  │  • Cooldown enforcement (4h minimum)          │      │
│  │  • Slippage guard (max 0.5%)                  │      │
│  │  • Confidence threshold (min 75%)             │      │
│  └──────┬───────────────────────────────────────┘      │
│         │                                               │
│  ┌──────▼───────────────────────────────────────┐      │
│  │        Base Sepolia (Uniswap V3)              │      │
│  │        On-chain swap execution                │      │
│  └──────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Features

- **🔗 Chainlink Data Streams** — Real-time, tamper-proof ETH/BTC/USDC prices verified on-chain
- **⚡ CRE Workflow Engine** — Smart trigger system that fires only when drift exceeds threshold
- **🧠 Gemini AI Reasoning** — LLM-powered decisions with confidence scoring and natural language reasoning
- **🦊 MetaMask Integration** — Secure wallet connection with `wallet_requestPermissions`
- **🛡️ Multi-Layer Safety** — 4 independent guards: confidence threshold, slippage, cooldown, human override
- **📊 Live Dashboard** — Real-time prices, allocation charts, AI terminal, and execution logs
- **📄 Technical Whitepaper** — Full 9-section documentation of the system
- **🌙 Dark Futuristic UI** — Custom design with neon accents, glassmorphism, and smooth animations

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 + TypeScript | React framework with App Router |
| Styling | Tailwind CSS v3 + Inline styles | Utility-first + custom components |
| Wallet | MetaMask (EIP-1193) | Web3 wallet connection |
| Oracle | Chainlink Data Streams | Tamper-proof price feeds |
| Automation | Chainlink CRE Workflows | Event-driven trigger engine |
| AI | Gemini 1.5 Flash | Portfolio reasoning and decisions |
| Network | Base Sepolia | EVM testnet for execution |
| DEX | Uniswap V3 | On-chain swap execution |
| Deployment | Vercel | Frontend hosting + serverless API |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- API keys: Chainlink, Gemini AI

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/autoportfolio.git
cd autoportfolio

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (see below)

# 4. Run the development server
npm run dev

# 5. Open in browser
# http://localhost:3000
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Chainlink (optional for testnet)
CHAINLINK_API_KEY=your_chainlink_api_key_here

# Network
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_NETWORK_NAME=Base Sepolia
```

> ⚠️ **Never commit `.env.local` to GitHub.** It is already in `.gitignore`.

---

## 📁 Project Structure

```
autoportfolio/
├── app/
│   ├── api/
│   │   ├── prices/route.ts       # Chainlink price feed API
│   │   └── analyze/route.ts      # Gemini AI analysis API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # App entry + routing
├── components/
│   ├── WalletContext.tsx          # MetaMask wallet state
│   ├── Navbar.tsx                 # Navigation bar
│   ├── LandingPage.tsx            # Marketing landing page
│   ├── Dashboard.tsx              # Live portfolio dashboard
│   ├── Whitepaper.tsx             # Technical documentation
│   └── Scene3D.tsx                # 3D background (optional)
├── lib/
│   ├── prices.ts                  # Price fetching utilities
│   ├── portfolio.ts               # Portfolio calculation logic
│   └── gemini.ts                  # Gemini AI integration
├── public/
├── .env.local                     # Environment variables (gitignored)
├── .env.example                   # Environment variables template
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔄 How It Works

### 1. Observe
Chainlink Data Streams deliver cryptographically signed ETH, BTC, and USDC prices every 30 seconds. Every price update is verified by the Decentralized Oracle Network before being used.

### 2. Trigger
The CRE Workflow Engine monitors portfolio allocations continuously. When any asset drifts more than **5%** from its target weight, the rebalancing pipeline is triggered.

### 3. Reason
Gemini 1.5 Flash receives full portfolio context including current prices, allocations, drift percentages, and market conditions. It returns a structured JSON decision with:
- Which assets to buy, sell, or hold
- Target percentages for each asset
- Confidence score (0–100%)
- Natural language reasoning

### 4. Execute
If confidence exceeds 75% and safety checks pass, approved swaps execute on Base Sepolia via Uniswap V3. Every action is logged on-chain with a transaction hash.

---

## 🛡️ Safety Mechanisms

| Guard | Threshold | Purpose |
|-------|-----------|---------|
| Confidence threshold | Min 75% | Only execute high-confidence AI decisions |
| Slippage guard | Max 0.5% | Prevent unfavorable swap execution |
| Cooldown period | Min 4 hours | Avoid over-trading on noise |
| Human override | Manual button | User can always cancel or modify |

---

## 🌐 Deployment on Vercel

```bash
# 1. Push to GitHub (see below)

# 2. Go to vercel.com → New Project → Import your repo

# 3. Add environment variables in Vercel dashboard:
#    GEMINI_API_KEY = your key
#    CHAINLINK_API_KEY = your key

# 4. Deploy → Done!
```

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🏆 Hackathon

Built for **Chainlink Convergence Hackathon 2026**
- Track: `#cre-ai` (Chainlink Runtime Environment + AI)
- Submission deadline: March 8, 2026

---

## ⚠️ Disclaimer

This project is deployed on **testnet only** and is for demonstration purposes. Do not use with real funds. Not financial advice.