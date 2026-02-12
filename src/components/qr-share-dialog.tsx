'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateQRCode, generateCredentialURL } from '@/lib/qr-code';
import { Copy, Download, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface QRShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credentialId: number;
  credentialName?: string;
}

export function QRShareDialog({ open, onOpenChange, credentialId, credentialName }: QRShareDialogProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const shareableUrl = generateCredentialURL(credentialId);

  useEffect(() => {
    if (open && !qrCode) {
      generateQR();
    }
  }, [open]);

  const generateQR = async () => {
    setLoading(true);
    try {
      const qr = await generateQRCode(shareableUrl, {
        size: 256,
        color: {
          dark: '#0284c7',
          light: '#ffffff',
        },
      });
      setQrCode(qr);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(shareableUrl);
    toast.success('Link copied to clipboard!');
  };

  const downloadQR = () => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `dresume-credential-${credentialId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-sky-600" />
            Share Credential
          </DialogTitle>
          <DialogDescription>
            Share your verified credential with employers using QR code or link
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
          ) : qrCode ? (
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-lg border-2 border-sky-200">
                <Image
                  src={qrCode}
                  alt="QR Code"
                  width={256}
                  height={256}
                  className="rounded"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={downloadQR}
                  className="border-sky-300 text-sky-700 hover:bg-sky-100"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={generateQR} className="w-full">
              Generate QR Code
            </Button>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-sky-900">Shareable Link</label>
            <div className="flex gap-2">
              <Input
                value={shareableUrl}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                variant="outline"
                onClick={copyUrl}
                className="border-sky-300 text-sky-700 hover:bg-sky-100"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
