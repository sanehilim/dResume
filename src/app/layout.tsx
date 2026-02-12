import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { SplashScreen } from "@/components/splash-screen";
import { ErrorBoundary } from "@/components/error-boundary";
import { Analytics } from "@/components/analytics";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "dResume - Decentralized Resume Verification",
    template: "%s | dResume",
  },
  description: "Transform your resume into verifiable on-chain credentials with AI-powered verification. Built on Polygon blockchain with IPFS storage.",
  keywords: [
    "resume verification",
    "blockchain credentials",
    "Soulbound Tokens",
    "SBT",
    "decentralized resume",
    "AI verification",
    "Polygon",
    "IPFS",
    "verifiable credentials",
    "job application",
    "hiring",
    "recruitment",
  ],
  authors: [{ name: "dResume Team" }],
  creator: "dResume",
  publisher: "dResume",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://d-resume-ten.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://d-resume-ten.vercel.app",
    title: "dResume - Decentralized Resume Verification",
    description: "Transform your resume into verifiable on-chain credentials with AI-powered verification",
    siteName: "dResume",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "dResume - Decentralized Resume Verification",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "dResume - Decentralized Resume Verification",
    description: "Transform your resume into verifiable on-chain credentials with AI-powered verification",
    images: ["/og-image.png"],
    creator: "@dResume",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0284c7" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "dResume",
              description: "Decentralized Resume Verification Platform",
              url: process.env.NEXT_PUBLIC_APP_URL || "https://d-resume-ten.vercel.app",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className={`${geistMono.variable} antialiased`}>
        <SplashScreen />
        <ErrorBoundary>
          <Providers>
            {children}
            <Toaster position="top-right" richColors />
          </Providers>
        </ErrorBoundary>
        <Analytics />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}