'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAccount, useReadContract } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Copy, CheckCircle, Shield, Calendar, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { DRESUME_SBT_ABI } from '@/lib/contract-abi';
import { QRShareDialog } from '@/components/qr-share-dialog';
import { useState } from 'react';

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

interface CredentialData {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  verificationScore: number;
  credentialId: number;
  ipfsHash: string;
  createdAt: string;
}

export default function CredentialsPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [credentials, setCredentials] = useState<CredentialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedCredentialId, setSelectedCredentialId] = useState<number | null>(null);

  const { data: userCredentialIds } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: DRESUME_SBT_ABI,
    functionName: 'getUserCredentials',
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    const fetchCredentials = async () => {
      try {
        const res = await fetch(`/api/credential?walletAddress=${address}`);
        const data = await res.json();
        setCredentials(data.credentials || []);
      } catch (error) {
        console.error('Error fetching credentials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, [address, isConnected, router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getShareableLink = (credentialId: number) => {
    return `${window.location.origin}/employer?credentialId=${credentialId}`;
  };

  if (!isConnected) return null;

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-sky-900 mb-2">My Credentials</h1>
          <p className="text-sky-600">Your on-chain verified credentials on Polygon Amoy</p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-card border-sky-200 animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-sky-200 rounded w-3/4 mb-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-sky-100 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : credentials.length === 0 ? (
          <Card className="glass-card border-sky-200 text-center py-12">
            <CardContent>
              <Award className="w-16 h-16 text-sky-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-sky-900 mb-2">No Credentials Yet</h3>
              <p className="text-sky-600 mb-6">Upload and verify your resume to mint your first credential</p>
              <Button 
                onClick={() => router.push('/upload')}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
              >
                Upload Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentials.map((cred, index) => (
              <motion.div
                key={cred._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-sky-200 overflow-hidden hover:shadow-lg transition-all">
                  <div className="h-2 bg-gradient-to-r from-sky-500 to-blue-600" />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sky-900">{cred.name}</CardTitle>
                        <p className="text-sm text-sky-600">{cred.email}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-sky-600" />
                        <span className="text-sm text-sky-700">Credential ID</span>
                      </div>
                      <span className="font-mono font-semibold text-sky-900">#{cred.credentialId}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-sky-600" />
                        <span className="text-sm text-sky-700">Score</span>
                      </div>
                      <span className="font-semibold text-sky-900">{cred.verificationScore}%</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-sky-600" />
                        <span className="text-sm text-sky-700">Issued</span>
                      </div>
                      <span className="text-sm text-sky-900">
                        {new Date(cred.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {cred.skills.slice(0, 5).map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-sky-100 text-sky-700 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 border-sky-300 text-sky-700 hover:bg-sky-100"
                        onClick={() => {
                          setSelectedCredentialId(cred.credentialId);
                          setQrDialogOpen(true);
                        }}
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-sky-300 text-sky-700 hover:bg-sky-100"
                        onClick={() => copyToClipboard(getShareableLink(cred.credentialId))}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      {cred.ipfsHash && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-sky-300 text-sky-700 hover:bg-sky-100"
                          onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${cred.ipfsHash}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {userCredentialIds && Array.isArray(userCredentialIds) && userCredentialIds.length > 0 && (
          <Card className="glass-card border-sky-200 mt-8">
            <CardHeader>
              <CardTitle className="text-sky-900">On-Chain Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sky-600 mb-4">
                Your credentials stored on Polygon Amoy blockchain:
              </p>
              <div className="flex flex-wrap gap-2">
                {userCredentialIds.map((id, i) => (
                  <Badge key={i} className="bg-sky-100 text-sky-700">
                    Token #{id.toString()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedCredentialId !== null && (
          <QRShareDialog
            open={qrDialogOpen}
            onOpenChange={setQrDialogOpen}
            credentialId={selectedCredentialId}
            credentialName={credentials.find(c => c.credentialId === selectedCredentialId)?.name}
          />
        )}
      </main>
    </div>
  );
}
