export const DRESUME_SBT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "metadataHash", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "verificationScore", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "CredentialMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "newMetadataHash", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "newScore", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "CredentialUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "credentialId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "endorser", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "message", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "EndorsementAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "issuer", "type": "address" },
      { "indexed": false, "internalType": "bool", "name": "status", "type": "bool" }
    ],
    "name": "IssuerVerified",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_credentialId", "type": "uint256" },
      { "internalType": "string", "name": "_message", "type": "string" }
    ],
    "name": "addEndorsement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "credentials",
    "outputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "string", "name": "metadataHash", "type": "string" },
      { "internalType": "uint256", "name": "verificationScore", "type": "uint256" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "address", "name": "issuer", "type": "address" },
      { "internalType": "bool", "name": "isActive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_tokenId", "type": "uint256" }],
    "name": "getCredential",
    "outputs": [
      { "internalType": "address", "name": "credOwner", "type": "address" },
      { "internalType": "string", "name": "metadataHash", "type": "string" },
      { "internalType": "uint256", "name": "verificationScore", "type": "uint256" },
      { "internalType": "string[]", "name": "skillTags", "type": "string[]" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "address", "name": "issuer", "type": "address" },
      { "internalType": "bool", "name": "isActive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_credentialId", "type": "uint256" }],
    "name": "getEndorsements",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "endorser", "type": "address" },
          { "internalType": "uint256", "name": "credentialId", "type": "uint256" },
          { "internalType": "string", "name": "message", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct DResumeSBT.Endorsement[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalCredentials",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getUserCredentials",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_metadataHash", "type": "string" },
      { "internalType": "uint256", "name": "_verificationScore", "type": "uint256" },
      { "internalType": "string[]", "name": "_skillTags", "type": "string[]" }
    ],
    "name": "mintCredential",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" },
      { "internalType": "string", "name": "_metadataHash", "type": "string" },
      { "internalType": "uint256", "name": "_verificationScore", "type": "uint256" },
      { "internalType": "string[]", "name": "_skillTags", "type": "string[]" }
    ],
    "name": "mintCredentialForUser",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_tokenId", "type": "uint256" }],
    "name": "revokeCredential",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_issuer", "type": "address" },
      { "internalType": "bool", "name": "_status", "type": "bool" }
    ],
    "name": "setVerifiedIssuer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_tokenId", "type": "uint256" },
      { "internalType": "string", "name": "_newMetadataHash", "type": "string" },
      { "internalType": "uint256", "name": "_newScore", "type": "uint256" },
      { "internalType": "string[]", "name": "_newSkillTags", "type": "string[]" }
    ],
    "name": "updateCredential",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "verifiedIssuers",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_tokenId", "type": "uint256" }],
    "name": "verifyCredential",
    "outputs": [
      { "internalType": "bool", "name": "exists", "type": "bool" },
      { "internalType": "bool", "name": "isActive", "type": "bool" },
      { "internalType": "address", "name": "credOwner", "type": "address" },
      { "internalType": "uint256", "name": "score", "type": "uint256" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
