import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { SplashScreen } from "@/components/splash-screen";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dResume - Decentralized Resume Verification",
  description: "Turn your resume into verifiable on-chain credentials with AI-powered verification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`}>
        <SplashScreen />
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}