'use client';

import Link from 'next/link';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { FileText, Briefcase, Award, Home, Wallet, LogOut, Upload } from 'lucide-react';
import { injected } from 'wagmi/connectors';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-sky-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">dResume</span>
            </Link>
            
            {isConnected && (
              <div className="hidden md:flex items-center gap-1">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-sky-700 hover:bg-sky-100">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button variant="ghost" size="sm" className="text-sky-700 hover:bg-sky-100">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </Link>
                <Link href="/credentials">
                  <Button variant="ghost" size="sm" className="text-sky-700 hover:bg-sky-100">
                    <Award className="w-4 h-4 mr-2" />
                    Credentials
                  </Button>
                </Link>
                <Link href="/employer">
                  <Button variant="ghost" size="sm" className="text-sky-700 hover:bg-sky-100">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Employer
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isConnected ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 dark:bg-sky-900 border border-sky-200 dark:border-sky-800">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-sky-700 dark:text-sky-300">
                    {truncateAddress(address!)}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => disconnect()}
                  className="border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => connect({ connector: injected() })}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}