'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useReadContract } from 'wagmi';
import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, CheckCircle, XCircle, Award, Calendar, User, ExternalLink, Loader2 } from 'lucide-react';
import { DRESUME_SBT_ABI } from '@/lib/contract-abi';
import { useSearchParams } from 'next/navigation';

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

function EmployerContent() {
  const searchParams = useSearchParams();
  const initialCredentialId = searchParams.get('credentialId') || '';
  
  const [credentialId, setCredentialId] = useState(initialCredentialId);
  const [searchedId, setSearchedId] = useState(initialCredentialId);

  const { data: credentialData, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: DRESUME_SBT_ABI,
    functionName: 'getCredential',
    args: searchedId ? [BigInt(searchedId)] : undefined,
    query: {
      enabled: !!searchedId,
    },
  });

  const { data: verificationData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: DRESUME_SBT_ABI,
    functionName: 'verifyCredential',
    args: searchedId ? [BigInt(searchedId)] : undefined,
    query: {
      enabled: !!searchedId,
    },
  });

  const handleSearch = () => {
    if (credentialId) {
      setSearchedId(credentialId);
      refetch();
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr || addr === '0x0000000000000000000000000000000000000000') return 'N/A';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: bigint) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-sky-900 mb-2">Employer Verification</h1>
          <p className="text-sky-600">Verify candidate credentials instantly on-chain</p>
        </motion.div>

        <Card className="glass-card border-sky-200 mb-8">
          <CardHeader>
            <CardTitle className="text-sky-900">Verify Credential</CardTitle>
            <CardDescription className="text-sky-600">
              Enter a credential ID to verify its authenticity on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input 
                placeholder="Enter Credential ID (e.g., 1)"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                className="border-sky-200 focus:border-sky-400"
              />
              <Button 
                onClick={handleSearch}
                disabled={!credentialId || isLoading}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Verify
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {searchedId && credentialData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="glass-card border-sky-200 overflow-hidden">
              <div className={`h-2 ${verificationData?.[1] ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sky-900 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Credential #{searchedId}
                  </CardTitle>
                  {verificationData?.[1] ? (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Valid & Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700">
                      <XCircle className="w-3 h-3 mr-1" />
                      Invalid or Revoked
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-sky-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sky-600 mb-1">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Owner</span>
                    </div>
                    <p className="font-mono text-sky-900">{formatAddress(credentialData[0] as string)}</p>
                  </div>
                  
                  <div className="p-4 bg-sky-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sky-600 mb-1">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">Verification Score</span>
                    </div>
                    <p className="text-2xl font-bold text-sky-900">{Number(credentialData[2])}%</p>
                  </div>
                  
                  <div className="p-4 bg-sky-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sky-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Issued Date</span>
                    </div>
                    <p className="text-sky-900">{formatTimestamp(credentialData[4] as bigint)}</p>
                  </div>
                  
                  <div className="p-4 bg-sky-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sky-600 mb-1">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Issuer</span>
                    </div>
                    <p className="font-mono text-sky-900">{formatAddress(credentialData[5] as string)}</p>
                  </div>
                </div>

                {credentialData[3] && Array.isArray(credentialData[3]) && credentialData[3].length > 0 && (
                  <div className="p-4 bg-sky-50 rounded-lg">
                    <p className="text-sm text-sky-600 mb-2">Verified Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {(credentialData[3] as string[]).map((skill, i) => (
                        <Badge key={i} className="bg-sky-100 text-sky-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {credentialData[1] && (
                  <div className="p-4 bg-sky-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-sky-600">IPFS Metadata</span>
                      <a 
                        href={`https://gateway.pinata.cloud/ipfs/${credentialData[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sky-600 hover:text-sky-800 text-sm"
                      >
                        View Full Report
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="font-mono text-xs text-sky-700 mt-1 break-all">{credentialData[1] as string}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card border-sky-200">
              <CardHeader>
                <CardTitle className="text-sky-900">Blockchain Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                    <span className="text-sky-600">Network</span>
                    <span className="font-medium text-sky-900">Polygon Amoy Testnet</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                    <span className="text-sky-600">Contract Address</span>
                    <span className="font-mono text-sm text-sky-900">{formatAddress(CONTRACT_ADDRESS)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                    <span className="text-sky-600">On-Chain Status</span>
                    {verificationData?.[0] ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Exists on Chain
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3 mr-1" />
                        Not Found
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {searchedId && !credentialData && !isLoading && (
          <Card className="glass-card border-sky-200 text-center py-12">
            <CardContent>
              <XCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-sky-900 mb-2">Credential Not Found</h3>
              <p className="text-sky-600">
                No credential found with ID #{searchedId}. Please check the ID and try again.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default function EmployerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen gradient-bg flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>}>
      <EmployerContent />
    </Suspense>
  );
}
