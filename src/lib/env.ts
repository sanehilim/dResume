/**
 * Environment variables validation
 * Validates all required environment variables on app startup
 */

const requiredEnvVars = {
  MONGODB_URI: process.env.MONGODB_URI,
  PINATA_API_KEY: process.env.PINATA_API_KEY,
  PINATA_SECRET_KEY: process.env.PINATA_SECRET_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
} as const;

const optionalEnvVars = {
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  POLYGON_AMOY_RPC: process.env.POLYGON_AMOY_RPC,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

export function validateEnv() {
  const missing: string[] = [];

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    const errorMessage = `Missing required environment variables: ${missing.join(', ')}\n\nPlease check your .env file.`;
    
    if (typeof window === 'undefined') {
      // Server-side: throw error
      throw new Error(errorMessage);
    } else {
      // Client-side: log warning
      console.error(errorMessage);
    }
  }

  return {
    ...requiredEnvVars,
    ...optionalEnvVars,
  };
}

export const env = validateEnv();
