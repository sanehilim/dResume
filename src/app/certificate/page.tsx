'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CertificateData {
  walletAddress: string;
  skill: string;
  score: number;
  verificationCode: string;
  issuedAt: string;
  ipfsHash: string;
}

function CertificateContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (code) {
      fetchCertificate();
    }
  }, [code]);

  const fetchCertificate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/certificate/verify?code=${code}`);
      const data = await res.json();
      
      if (data.valid) {
        setCertificate(data.certificate);
      } else {
        toast.error('Certificate not found');
      }
    } catch (error) {
      toast.error('Failed to load certificate');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !certificate) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${certificate.skill}</title>
        <style>
          @page { size: landscape; margin: 0; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
          }
          .certificate {
            background: white;
            width: 1000px;
            padding: 80px;
            border: 20px solid #0ea5e9;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .corner {
            position: absolute;
            width: 80px;
            height: 80px;
            border: 8px solid #0ea5e9;
          }
          .corner.tl { top: 40px; left: 40px; border-right: none; border-bottom: none; }
          .corner.tr { top: 40px; right: 40px; border-left: none; border-bottom: none; }
          .corner.bl { bottom: 40px; left: 40px; border-right: none; border-top: none; }
          .corner.br { bottom: 40px; right: 40px; border-left: none; border-top: none; }
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          .title {
            font-size: 56px;
            color: #0ea5e9;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .subtitle {
            font-size: 24px;
            color: #64748b;
            font-style: italic;
          }
          .content {
            text-align: center;
            margin: 60px 0;
          }
          .awarded {
            font-size: 20px;
            color: #64748b;
            margin-bottom: 20px;
          }
          .skill {
            font-size: 48px;
            color: #0f172a;
            font-weight: bold;
            margin: 30px 0;
          }
          .score {
            font-size: 32px;
            color: #059669;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .signature {
            text-align: center;
            flex: 1;
          }
          .signature-line {
            border-top: 2px solid #0ea5e9;
            width: 200px;
            margin: 20px auto 10px;
          }
          .date {
            text-align: center;
            flex: 1;
          }
          .date-value {
            font-size: 16px;
            color: #0f172a;
            margin-top: 10px;
          }
          .verification {
            margin-top: 40px;
            text-align: center;
            padding: 20px;
            background: #f0f9ff;
            border-radius: 10px;
          }
          .code {
            font-size: 20px;
            font-weight: bold;
            color: #0ea5e9;
            font-family: monospace;
            margin: 10px 0;
          }
          .verify-url {
            font-size: 14px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="corner tl"></div>
          <div class="corner tr"></div>
          <div class="corner bl"></div>
          <div class="corner br"></div>
          
          <div class="header">
            <div class="title">CERTIFICATE</div>
            <div class="subtitle">of Achievement</div>
          </div>
          
          <div class="content">
            <div class="awarded">This certificate is proudly presented to</div>
            <div class="skill">${certificate.skill}</div>
            <div class="awarded">for successfully demonstrating proficiency in</div>
            <div class="score">Score: ${certificate.score}%</div>
          </div>
          
          <div class="footer">
            <div class="signature">
              <div class="signature-line"></div>
              <div>Authorized Signature</div>
            </div>
            <div class="date">
              <div>Date of Issue</div>
              <div class="date-value">${new Date(certificate.issuedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
          </div>
          
          <div class="verification">
            <div>Verification Code</div>
            <div class="code">${certificate.verificationCode}</div>
            <div class="verify-url">Verify at: ${window.location.origin}/certificate-verify</div>
            <div style="margin-top: 10px; font-size: 12px; color: #94a3b8;">
              Wallet: ${certificate.walletAddress.slice(0, 10)}...${certificate.walletAddress.slice(-8)}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
          <p className="text-sky-600">Loading certificate...</p>
        </main>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-red-600 text-xl">Certificate not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card border-8 border-sky-300 overflow-hidden">
            <CardContent className="p-12 md:p-16 bg-gradient-to-br from-white to-sky-50">
              <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-sky-400" />
              <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-sky-400" />
              <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-sky-400" />
              <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-sky-400" />
              
              <div className="text-center space-y-8">
                <div>
                  <Award className="w-24 h-24 text-sky-500 mx-auto mb-4" />
                  <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-2">
                    CERTIFICATE
                  </h1>
                  <p className="text-2xl text-sky-600 italic">of Achievement</p>
                </div>
                
                <div className="my-12">
                  <p className="text-lg text-sky-700 mb-4">This certificate is proudly presented to</p>
                  <h2 className="text-4xl md:text-5xl font-bold text-sky-900 mb-8">
                    {certificate.skill}
                  </h2>
                  <p className="text-lg text-sky-700 mb-6">for successfully demonstrating proficiency in</p>
                  <div className="inline-flex items-center gap-2 bg-green-100 px-6 py-3 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-2xl font-bold text-green-700">
                      Score: {certificate.score}%
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-around items-center pt-12 border-t-2 border-sky-200">
                  <div className="text-center mb-6 md:mb-0">
                    <div className="w-48 h-0.5 bg-sky-400 mb-2" />
                    <p className="text-sky-600">Authorized Signature</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sky-600 mb-2">Date of Issue</p>
                    <p className="text-lg font-semibold text-sky-900">
                      {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-lg mt-8">
                  <p className="text-sm text-sky-700 mb-2">Verification Code</p>
                  <p className="text-2xl font-mono font-bold text-sky-900 mb-3">
                    {certificate.verificationCode}
                  </p>
                  <p className="text-xs text-sky-600 mb-2">
                    Verify at: {window.location.origin}/certificate-verify
                  </p>
                  {certificate.ipfsHash && (
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${certificate.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800"
                    >
                      View on IPFS
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <p className="text-xs text-sky-500 mt-2">
                    Wallet: {certificate.walletAddress.slice(0, 10)}...{certificate.walletAddress.slice(-8)}
                  </p>
                </div>
                
                <Button
                  onClick={downloadPDF}
                  size="lg"
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 mt-6"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

export default function CertificatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    }>
      <CertificateContent />
    </Suspense>
  );
}
