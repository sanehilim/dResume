# dResume Deployment Guide

## Smart Contract Deployment (Using Remix)

1. **Open Remix IDE**: Go to https://remix.ethereum.org

2. **Create Contract File**:
   - Create a new file `DResumeSBT.sol`
   - Copy the contract from `contracts/DResumeSBT.sol` in this project

3. **Compile the Contract**:
   - Go to the "Solidity Compiler" tab
   - Select Solidity version `0.8.20`
   - Enable optimization (200 runs)
   - Click "Compile DResumeSBT.sol"

4. **Connect MetaMask**:
   - Make sure MetaMask is connected to Polygon Amoy Testnet
   - Network details:
     - Network Name: Polygon Amoy Testnet
     - RPC URL: https://rpc-amoy.polygon.technology/
     - Chain ID: 80002
     - Currency Symbol: MATIC
     - Block Explorer: https://amoy.polygonscan.com/

5. **Get Test MATIC**:
   - Visit https://faucet.polygon.technology/
   - Select "Polygon Amoy"
   - Enter your wallet address
   - Request test MATIC

6. **Deploy Contract**:
   - Go to "Deploy & Run Transactions" tab
   - Select "Injected Provider - MetaMask" as environment
   - Select "DResumeSBT" contract
   - Click "Deploy"
   - Confirm transaction in MetaMask
   - **IMPORTANT**: Copy the deployed contract address

7. **Update Contract Address**:
   - In your project, open `src/lib/contract-address.json`
   - Replace the `contractAddress` with your deployed address:
   ```json
   {
     "contractAddress": "0xYOUR_DEPLOYED_ADDRESS_HERE",
     "network": "polygon-amoy",
     "chainId": 80002,
     "deployedAt": "2025-12-12"
   }
   ```

8. **Update Environment Variable**:
   - Add to your `.env` file:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_ADDRESS_HERE
   ```

## Application Setup

### Prerequisites
- Node.js 18+ or Bun
- MetaMask wallet
- MongoDB Atlas account
- Pinata account
- Google AI (Gemini) API key

### Environment Variables
All credentials are already in `.env`:
```
PRIVATE_KEY=...
POLYGON_AMOY_RPC=...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
MONGODB_URI=...
GEMINI_API_KEY=...
PINATA_API_KEY=...
PINATA_SECRET_KEY=...
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_ADDRESS_HERE
```

### Installation & Running

1. **Install Dependencies**:
   ```bash
   bun install
   ```

2. **Run Development Server**:
   ```bash
   bun dev
   ```

3. **Open Application**:
   - Navigate to http://localhost:3002
   - Connect your MetaMask wallet
   - Make sure you're on Polygon Amoy Testnet

## Features Guide

### For Job Seekers:
1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Create Profile**: Go to Profile page and fill in your details
3. **Upload Resume**: Navigate to Upload page and enter your resume details
4. **Get AI Verification**: Click verify to get AI credibility score
5. **Mint Credential**: After verification, mint your on-chain SBT
6. **View Analytics**: Check your profile performance in Analytics
7. **Find Jobs**: Use AI Job Matching to find suitable positions

### For Employers:
1. **Connect Wallet**: Connect MetaMask wallet
2. **Verify Candidates**: Go to Employer page
3. **Enter Wallet Address**: Input candidate's wallet address
4. **View Credentials**: See verified credentials and AI scores
5. **Issue Endorsements**: (Feature ready for on-chain endorsements)

## Smart Contract Functions

- `mintCredential(address recipient, string metadataHash)`: Mint new credential SBT
- `getCredential(uint256 tokenId)`: Get credential details
- `updateVerificationScore(uint256 tokenId, uint256 newScore)`: Update score
- `revokeCredential(uint256 tokenId)`: Revoke credential
- `getTokensOfOwner(address owner)`: Get all tokens owned by address

## Testing On-Chain Functionality

1. **Mint a Test Credential**:
   - Upload resume and verify
   - Click "Mint Credential"
   - Confirm transaction in MetaMask
   - Wait for confirmation

2. **Verify On-Chain**:
   - Go to https://amoy.polygonscan.com/
   - Search your contract address
   - View transactions and contract state

3. **Check Credential**:
   - Go to Credentials page
   - See your minted credentials
   - Share credential link

## MongoDB Collections

The app uses these MongoDB collections:
- `users`: User profiles and wallet info
- `resumes`: Resume data and skills
- `verifications`: AI verification results

## Pinata IPFS Storage

- Resume metadata stored on IPFS
- Verification reports stored permanently
- Accessible via IPFS hash

## Troubleshooting

### Contract Deployment Issues:
- Ensure you have enough test MATIC
- Check MetaMask is on correct network
- Verify contract compiles without errors

### Connection Issues:
- Clear MetaMask activity tab data
- Switch network back and forth
- Refresh page after connecting

### Transaction Failures:
- Check gas limits
- Ensure contract address is correct
- Verify wallet has test MATIC

## Security Notes

- Never share your private keys
- Use test networks only for development
- Contract is unaudited - for demo purposes
- Keep environment variables secure

## Support

For issues or questions:
- Check browser console for errors
- Verify all environment variables are set
- Ensure MongoDB, Pinata, and Gemini services are active
- Check Polygon Amoy network status
