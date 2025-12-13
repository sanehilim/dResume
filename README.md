# 🎯 dResume - Decentralized Resume Verification Platform

<div align="center">

![dResume Logo](https://img.shields.io/badge/dResume-Blockchain%20Verified-00bfff?style=for-the-badge&logo=ethereum&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-lightgrey?style=flat-square&logo=solidity)](https://soliditylang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Polygon](https://img.shields.io/badge/Polygon-Amoy-8247e5?style=flat-square&logo=polygon)](https://polygon.technology/)

**Transform your resume into verifiable on-chain credentials with AI-powered verification**

[Live Demo](#) • [Documentation](#features) • [Deploy Guide](./REMIX_DEPLOYMENT_GUIDE.md)

live web url - https://d-resume-ten.vercel.app/
live demo url - https://youtu.be/kj5DEoQ8MFY
 
</div>

---

## 📖 What is dResume?

**dResume** is a decentralized resume verification platform that combines blockchain technology, artificial intelligence, and IPFS storage to create tamper-proof, verifiable professional credentials. Say goodbye to resume fraud and hello to trustworthy hiring.

### 🎯 The Problem We Solve

- **Resume Fraud**: 85% of employers catch lies on resumes
- **Verification Delays**: Manual verification takes days or weeks
- **Credential Portability**: Your credentials are locked in centralized systems
- **Trust Issues**: Employers can't easily verify candidate claims

### 💡 Our Solution

dResume mints **Soulbound Tokens (SBTs)** - non-transferable blockchain credentials that:
- ✅ Are permanently stored on-chain (Polygon blockchain)
- ✅ Use AI to verify resume authenticity and calculate credibility scores
- ✅ Store data on decentralized IPFS for censorship-resistance
- ✅ Enable instant, one-click verification by employers
- ✅ Give you portable, provable credentials you truly own

---

## ✨ Features

### 🔐 For Job Seekers

| Feature | Description |
|---------|-------------|
| **AI-Powered Verification** | Google Gemini analyzes your resume, skills, and experience to generate credibility scores (0-100%) |
| **Soulbound Token Credentials** | Mint non-transferable NFTs on Polygon that prove your skills permanently |
| **IPFS Storage** | Your credentials are stored on decentralized Pinata IPFS - no single point of failure |
| **Profile Management** | Build comprehensive profiles with social links, bio, and professional information |
| **Analytics Dashboard** | Track profile views, verification scores, and career progression |
| **AI Career Assistant** | Get personalized career advice and skill gap analysis powered by Gemini AI |
| **Job Matching** | AI-powered job recommendations based on your verified skills |
| **Shareable Links** | Share your verifiable credential URL with employers and on social media |

### 💼 For Employers

| Feature | Description |
|---------|-------------|
| **Instant Verification** | Verify any candidate's credentials by wallet address or token ID in seconds |
| **On-Chain Proof** | All credentials are cryptographically secured on Polygon blockchain |
| **Skill Endorsements** | Issue endorsements to candidates you've worked with to build their reputation |
| **Detailed Reports** | View AI verification scores, IPFS metadata, and credential history |
| **Anti-Fraud Protection** | Blockchain immutability prevents credential tampering |

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom light blue theme
- **Framer Motion** - Smooth animations
- **shadcn/ui** - Beautiful, accessible components
- **Wagmi + Viem** - Ethereum wallet integration

### Backend
- **MongoDB Atlas** - User profiles, resumes, and analytics
- **Pinata IPFS** - Decentralized credential storage
- **Google Gemini AI** - Resume verification and career advice
- **Next.js API Routes** - Serverless API endpoints

### Blockchain
- **Polygon Amoy Testnet** - Fast, low-cost transactions
- **Solidity 0.8.20** - Smart contract development
- **Hardhat** - Development environment
- **Remix IDE** - Browser-based deployment

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask wallet with Polygon Amoy testnet configured
- MongoDB Atlas account (free tier works)
- Pinata account for IPFS
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/dresume-app.git
cd dresume-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dresume?retryWrites=true&w=majority

# Pinata IPFS
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Smart Contract (update after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5b3E9d56633aa0c661655fC3b11975ca6166997D

# Polygon RPC (optional - uses public RPC by default)
POLYGON_AMOY_RPC=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
```

4. **Run the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your app! 🎉

---

## 📝 Smart Contract Deployment

We've created a comprehensive deployment guide for deploying your smart contract via Remix IDE:

👉 **[View Remix Deployment Guide](./REMIX_DEPLOYMENT_GUIDE.md)**

### Quick Deploy Steps

1. Open [Remix IDE](https://remix.ethereum.org)
2. Copy contract from `contracts/DResumeSBT.sol`
3. Compile with Solidity 0.8.20
4. Deploy to Polygon Amoy testnet using Injected Provider (MetaMask)
5. Copy deployed contract address
6. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env`
7. Update `src/lib/contract-address.json` with the new address

**That's it!** Your dResume platform is now fully on-chain. ⛓️

---

## 📱 Pages & Features

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Landing page with features showcase |
| **Dashboard** | `/dashboard` | Stats, quick actions, and resume management |
| **Upload Resume** | `/upload` | Multi-step resume upload wizard |
| **Verify** | `/verify` | Start AI verification process |
| **Credentials** | `/credentials` | View your minted SBT credentials |
| **Profile** | `/profile` | Manage personal info and social links |
| **Analytics** | `/analytics` | Profile views, scores, and activity trends |
| **Jobs** | `/jobs` | AI-powered job matching |
| **AI Assistant** | `/ai-assistant` | Career advice and skill analysis |
| **Employer** | `/employer` | Verify candidate credentials |

---

## 🎨 Design Philosophy

dResume uses a **light blue and white color scheme** inspired by trust, professionalism, and clarity:

- **Primary Colors**: Sky blue (`#0ea5e9`) and white
- **Glass Morphism**: Frosted glass effect cards with backdrop blur
- **Smooth Animations**: Framer Motion for delightful micro-interactions
- **Responsive**: Mobile-first design that works on all devices
- **Accessibility**: WCAG 2.1 AA compliant with proper contrast ratios

---

## 🔗 API Routes

### Resume Management
- `POST /api/resume` - Create resume
- `GET /api/resume?walletAddress=0x...` - Get user resumes

### AI Verification
- `POST /api/verify` - Verify resume with Gemini AI
- `POST /api/ai/career-advice` - Get career advice
- `POST /api/ai/skill-match` - Match skills to jobs

### User Profile
- `POST /api/profile` - Create/update profile
- `GET /api/profile?walletAddress=0x...` - Get profile

### Analytics
- `GET /api/analytics?walletAddress=0x...` - Get user analytics

### Credentials
- `POST /api/credential/mint` - Mint SBT credential
- `GET /api/credential?tokenId=1` - Get credential details

### Job Matching
- `POST /api/jobs/match` - Get AI job recommendations

---

## 🧪 Testing

### Test API Routes
```bash
# Test resume API
curl http://localhost:3000/api/resume?walletAddress=0xYourAddress

# Test verification (requires Gemini API)
curl -X POST http://localhost:3000/api/verify \
  -H "Content-Type: application/json" \
  -d '{"resumeText":"Sample resume","skills":["React","TypeScript"]}'
```

### Test Smart Contract

After deployment, test on-chain functionality:
1. Connect wallet on the Dashboard
2. Upload a resume
3. Run AI verification
4. Mint credential (requires testnet MATIC)
5. View credential on Credentials page
6. Share credential link with employers

---

 

## 📊 Project Structure

```
dresume-app/
├── contracts/              # Solidity smart contracts
│   └── DResumeSBT.sol     # SBT credential contract
├── src/
│   ├── app/               # Next.js pages (App Router)
│   │   ├── page.tsx       # Home page
│   │   ├── dashboard/     # Dashboard page
│   │   ├── upload/        # Resume upload
│   │   ├── verify/        # Verification page
│   │   ├── credentials/   # View credentials
│   │   ├── profile/       # User profile
│   │   ├── analytics/     # Analytics dashboard
│   │   ├── jobs/          # Job matching
│   │   ├── employer/      # Employer verification
│   │   └── api/           # API routes
│   ├── components/        # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── navbar.tsx     # Navigation bar
│   │   └── splash-screen.tsx  # Loading splash
│   └── lib/               # Utilities
│       ├── mongodb.ts     # MongoDB client
│       ├── pinata.ts      # IPFS client
│       ├── gemini.ts      # AI client
│       ├── contract-abi.ts # Smart contract ABI
│       └── wagmi-config.ts # Web3 config
├── .env                   # Environment variables
├── package.json           # Dependencies
└── README.md             # You are here!
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Polygon** - Fast, affordable blockchain infrastructure
- **Pinata** - Reliable IPFS pinning service
- **Google Gemini** - Powerful AI for verification
- **shadcn/ui** - Beautiful component library
- **Wagmi** - Best-in-class Web3 hooks

---

## 📞 Support

Need help? Reach out:

- 📧 Email: support@dresume.com
- 💬 Discord: [Join our community](#)
- 🐦 Twitter: [@dResume](#)
- 📚 Docs: [Full documentation](./PROJECT_SUMMARY.md)

---

<div align="center">

**Built with ❤️ for the future of work**

[⭐ Star us on GitHub](https://github.com/yourusername/dresume-app) • [🌐 Visit Website](#) • [📖 Read Docs](./PROJECT_SUMMARY.md)

</div>
