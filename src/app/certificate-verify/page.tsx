'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Search, CheckCircle, XCircle, Award, ExternalLink, 
  Loader2, Shield 
} from 'lucide-react';

interface VerificationResult {
  valid: boolean;
  certificate?: {
    walletAddress: string;
    skill: string;
    score: number;
    verificationCode: string;
    issuedAt: string;
    ipfsHash: string;
  };
  test?: {
    totalQuestions: number;
    correctAnswers: number;
    completedAt: string;
  };
}

export default function CertificateVerifyPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const verify = async () => {
    if (!code.trim()) {
      toast.error('Please enter a verification code');
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch(`/api/certificate/verify?code=${code.trim()}`);
      const data = await res.json();
      
      setResult(data);
      
      if (data.valid) {
        toast.success('Certificate verified successfully!');
      } else {
        toast.error('Certificate not found or invalid');
      }
    } catch (error) {
      toast.error('Failed to verify certificate');
      console.error(error);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-sky-900 mb-2">Verify Certificate</h1>
          <p className="text-sky-600">Enter a verification code to check certificate authenticity</p>
        </motion.div>

        <Card className="glass-card border-sky-200 mb-8">
          <CardHeader>
            <CardTitle className="text-sky-900 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Certificate Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sky-700 mb-2">
                Verification Code
              </label>
              <div className="flex gap-3">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && verify()}
                  placeholder="Enter verification code (e.g., 1A2B3C4D5E6F7G8H)"
                  className="font-mono"
                  maxLength={16}
                />
                <Button
                  onClick={verify}
                  disabled={loading || !code.trim()}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Verify
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {result.valid && result.certificate ? (
              <Card className="glass-card border-green-300">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-700 mb-1">
                        Certificate Verified
                      </h3>
                      <p className="text-green-600">
                        This certificate is authentic and valid
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-sky-50 p-4 rounded-lg">
                      <p className="text-sm text-sky-600 mb-1">Skill</p>
                      <p className="text-lg font-semibold text-sky-900">{result.certificate.skill}</p>
                    </div>
                    <div className="bg-sky-50 p-4 rounded-lg">
                      <p className="text-sm text-sky-600 mb-1">Score</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold text-sky-900">{result.certificate.score}%</p>
                        <Badge className="bg-green-100 text-green-700">Passed</Badge>
                      </div>
                    </div>
                    <div className="bg-sky-50 p-4 rounded-lg">
                      <p className="text-sm text-sky-600 mb-1">Issued Date</p>
                      <p className="text-lg font-semibold text-sky-900">
                        {new Date(result.certificate.issuedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="bg-sky-50 p-4 rounded-lg">
                      <p className="text-sm text-sky-600 mb-1">Wallet Address</p>
                      <p className="text-sm font-mono text-sky-900">
                        {result.certificate.walletAddress.slice(0, 10)}...
                        {result.certificate.walletAddress.slice(-8)}
                      </p>
                    </div>
                  </div>

                  {result.test && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold text-sky-900 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Test Results
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-sky-600">Correct Answers</p>
                          <p className="font-semibold text-sky-900">
                            {result.test.correctAnswers} / {result.test.totalQuestions}
                          </p>
                        </div>
                        <div>
                          <p className="text-sky-600">Completion Date</p>
                          <p className="font-semibold text-sky-900">
                            {new Date(result.test.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.certificate.ipfsHash && (
                    <div className="border-t border-sky-200 pt-4">
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${result.certificate.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-800 text-sm"
                      >
                        View certificate data on IPFS
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card border-red-300">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-700 mb-1">
                        Certificate Not Found
                      </h3>
                      <p className="text-red-600">
                        The verification code you entered is invalid or the certificate does not exist.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        <Card className="glass-card border-sky-200 mt-8">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-sky-900 mb-3">About Certificate Verification</h3>
            <ul className="space-y-2 text-sm text-sky-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                All certificates are stored on IPFS for permanent, decentralized verification
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Each certificate has a unique verification code that cannot be duplicated
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Only users who score 60% or above on the test receive certificates
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
