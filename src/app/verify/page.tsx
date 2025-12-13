'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Shield, CheckCircle, XCircle, AlertTriangle, Loader2, Award, ExternalLink, Sparkles } from 'lucide-react';
import { DRESUME_SBT_ABI } from '@/lib/contract-abi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x5b3E9d56633aa0c661655fC3b11975ca6166997D';

interface VerificationData {
  score: number;
  overallAssessment: string;
  skillsVerified: Array<{ skill: string; verified: boolean; confidence: number; evidence?: string }> | null;
  educationVerified: Array<{ institution: string; verified: boolean; confidence: number }> | null;
  experienceVerified: Array<{ company: string; verified: boolean; confidence: number }> | null;
  redFlags: string[];
  strengths: string[];
  ipfsHash: string;
}

function VerifyContent() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resumeId');
  
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verification, setVerification] = useState<VerificationData | null>(null);
  const [resume, setResume] = useState<{ name: string; skills: string[]; ipfsHash?: string; credentialId?: number } | null>(null);
  const [minting, setMinting] = useState(false);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    if (resumeId) {
      fetchVerification();
    }
  }, [resumeId, isConnected, router]);

  useEffect(() => {
    if (isTxSuccess && hash) {
      saveCredential();
    }
  }, [isTxSuccess, hash]);

  const fetchVerification = async () => {
    setLoading(true);
    try {
      const verRes = await fetch(`/api/verify?resumeId=${resumeId}`);
      const verData = await verRes.json();
      
      if (verData.verification) {
        setVerification({
          score: verData.verification.score,
          overallAssessment: verData.verification.overallAssessment,
          skillsVerified: verData.verification.skillsVerified,
          educationVerified: verData.verification.educationVerified,
          experienceVerified: verData.verification.experienceVerified,
          redFlags: verData.verification.redFlags,
          strengths: verData.verification.strengths,
          ipfsHash: verData.verification.ipfsHash,
        });
      }

      const resumeRes = await fetch(`/api/resume?walletAddress=${address}`);
      const resumeData = await resumeRes.json();
      const currentResume = resumeData.resumes?.find((r: { _id: string }) => r._id === resumeId);
      if (currentResume) {
        setResume(currentResume);
      }
    } catch (error) {
      console.error('Error fetching verification:', error);
    } finally {
      setLoading(false);
    }
  };

  const startVerification = async () => {
    setVerifying(true);
    try {
      console.log('Starting verification with:', { resumeId, address });
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, walletAddress: address }),
      });

      const data = await res.json();
      console.log('Verification response:', data);

      if (data.success) {
        toast.success('Verification complete!');
        setVerification({
          score: data.verification.score,
          overallAssessment: data.verification.overallAssessment,
          skillsVerified: data.verification.skillsVerified,
          educationVerified: data.verification.educationVerified,
          experienceVerified: data.verification.experienceVerified,
          redFlags: data.verification.redFlags,
          strengths: data.verification.strengths,
          ipfsHash: data.ipfsHash,
        });
        fetchVerification();
      } else {
        toast.error(data.error || 'Verification failed');
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const mintCredential = async () => {
    if (!verification || !resume) return;
    
    setMinting(true);
    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: DRESUME_SBT_ABI,
        functionName: 'mintCredential',
        args: [verification.ipfsHash, BigInt(verification.score), resume.skills],
      });
    } catch (error) {
      toast.error('Failed to mint credential');
      console.error(error);
      setMinting(false);
    }
  };

  const saveCredential = async () => {
    try {
      await fetch('/api/credential', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          walletAddress: address,
          credentialId: 1,
          txHash: hash,
        }),
      });
      toast.success('Credential minted successfully!');
      router.push('/credentials');
    } catch (error) {
      console.error(error);
    } finally {
      setMinting(false);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-sky-900 mb-2">AI Verification</h1>
          <p className="text-sky-600">Get your resume verified by our AI system</p>
        </motion.div>

        {loading ? (
          <Card className="glass-card border-sky-200">
            <CardContent className="py-12 text-center">
              <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
              <p className="text-sky-600">Loading verification data...</p>
            </CardContent>
          </Card>
        ) : !verification ? (
          <Card className="glass-card border-sky-200">
            <CardContent className="py-12 text-center">
              <Shield className="w-16 h-16 text-sky-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-sky-900 mb-2">Ready for Verification</h3>
              <p className="text-sky-600 mb-6 max-w-md mx-auto">
                Our AI will analyze your resume, verify your skills, education, and experience, 
                and provide a credibility score.
              </p>
              <Button 
                onClick={startVerification}
                disabled={verifying}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start AI Verification
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="glass-card border-sky-200">
              <CardHeader>
                <CardTitle className="text-sky-900 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Verification Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white ${
                    verification.score >= 70 ? 'bg-green-500' : verification.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {verification.score}
                  </div>
                  <div className="flex-1">
                    <Progress value={verification.score} className="h-3 mb-2" />
                    <p className="text-sky-700">{verification.overallAssessment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {verification.strengths.length > 0 && (
              <Card className="glass-card border-sky-200">
                <CardHeader>
                  <CardTitle className="text-sky-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {verification.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2 text-sky-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {verification.redFlags.length > 0 && (
              <Card className="glass-card border-sky-200">
                <CardHeader>
                  <CardTitle className="text-sky-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Areas of Concern
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {verification.redFlags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2 text-sky-700">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card className="glass-card border-sky-200">
              <CardHeader>
                <CardTitle className="text-sky-900">Skills Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {verification.skillsVerified?.map((skill, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {skill.verified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="font-medium text-sky-900">{skill.skill}</span>
                      </div>
                      <Badge className={skill.verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {skill.confidence}% confidence
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {resume && !resume.credentialId && verification.score >= 60 && (
              <Card className="glass-card border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-sky-900 mb-1">Mint Your Credential</h3>
                      <p className="text-sky-600 text-sm">
                        Your verification passed! Mint an on-chain credential on Polygon Amoy.
                      </p>
                    </div>
                    <Button 
                      onClick={mintCredential}
                      disabled={minting || isTxLoading}
                      className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                    >
                      {minting || isTxLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Minting...
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4 mr-2" />
                          Mint Credential
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {verification.ipfsHash && (
              <Card className="glass-card border-sky-200">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sky-600 text-sm">IPFS Hash</span>
                    <a 
                      href={`https://gateway.pinata.cloud/ipfs/${verification.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sky-600 hover:text-sky-800 text-sm"
                    >
                      {verification.ipfsHash.slice(0, 20)}...
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen gradient-bg flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>} >
      <VerifyContent />
    </Suspense>
  );
}