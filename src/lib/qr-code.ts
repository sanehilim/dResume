/**
 * QR Code generation for credential sharing
 * Uses qrcode library (needs to be installed)
 */

export interface QRCodeOptions {
  size?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export async function generateQRCode(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const { size = 256, margin = 2, color = { dark: '#000000', light: '#FFFFFF' } } = options;

  // Dynamic import to avoid SSR issues
  const QRCode = (await import('qrcode')).default;
  
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin,
      color: {
        dark: color.dark,
        light: color.light,
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export function generateCredentialURL(tokenId: number, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/credentials?id=${tokenId}`;
}

export function generateVerificationURL(code: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/certificate-verify?code=${code}`;
}
