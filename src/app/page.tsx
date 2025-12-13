'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Shield, FileText, Award, Briefcase, CheckCircle, 
  Zap, Lock, Globe, ArrowRight, Sparkles 
} from 'lucide-react';

export default function HomePage() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const router = useRouter();

  const features = [
    {
      icon: Shield,
      title: 'AI-Powered Verification',
      description: 'Advanced AI analyzes your resume, projects, and certificates to provide credibility scores'
    },
    {
      icon: Lock,
      title: 'On-Chain Credentials',
      description: 'Mint your verified credentials as Soulbound Tokens on Polygon for tamper-proof verification'
    },
    {
      icon: Globe,
      title: 'IPFS Storage',
      description: 'Your credential data is stored on decentralized IPFS for permanent, censorship-resistant access'
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Employers can instantly verify your credentials with a single click'
    },
    {
      icon: Award,
      title: 'Skill Endorsements',
      description: 'Get endorsements from employers and peers that add credibility to your profile'
    },
    {
      icon: Sparkles,
      title: 'AI Career Assistant',
      description: 'Get personalized career advice and job matching powered by AI'
    }
  ];

  const steps = [
    { step: '01', title: 'Connect Wallet', description: 'Link your MetaMask or any Web3 wallet' },
    { step: '02', title: 'Upload Resume', description: 'Add your education, experience, and skills' },
    { step: '03', title: 'AI Verification', description: 'Our AI analyzes and verifies your credentials' },
    { step: '04', title: 'Mint Credential', description: 'Get your verified SBT on Polygon' },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 border border-sky-200 mb-6">
            <span className="text-sky-600 text-sm font-medium">Powered by Polygon Amoy Testnet</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Decentralized</span>
            <br />
            <span className="text-sky-900">Resume Verification</span>
          </h1>
          
          <p className="text-xl text-sky-700 max-w-2xl mx-auto mb-10">
            Transform your resume into verifiable on-chain credentials. 
            AI-powered verification meets blockchain security.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isConnected ? (
              <Button 
                size="lg"
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-8 py-6 text-lg"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button 
                size="lg"
                onClick={() => connect({ connector: injected() })}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-8 py-6 text-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/test')}
              className="border-sky-300 text-sky-700 hover:bg-sky-100 px-8 py-6 text-lg"
            >
              <Award className="w-5 h-5 mr-2" />
              Take Skill Test
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/employer')}
              className="border-sky-300 text-sky-700 hover:bg-sky-100 px-8 py-6 text-lg"
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Verify Candidates
            </Button>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="py-20"
        >
          <h2 className="text-3xl font-bold text-center text-sky-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Card className="glass-card border-sky-200 h-full text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">{item.step}</span>
                    </div>
                    <CardTitle className="text-sky-900">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sky-600">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="py-20"
        >
          <h2 className="text-3xl font-bold text-center text-sky-900 mb-4">Features</h2>
          <p className="text-center text-sky-600 mb-12 max-w-2xl mx-auto">
            Everything you need to build trust in your professional credentials
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Card className="glass-card border-sky-200 h-full hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center mb-3">
                      <feature.icon className="w-6 h-6 text-sky-600" />
                    </div>
                    <CardTitle className="text-sky-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sky-600">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="py-20"
        >
          <Card className="glass-card border-sky-200 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-sky-900 mb-4">For Job Seekers</h2>
                <ul className="space-y-4">
                  {[
                    'Create verifiable credentials that employers trust',
                    'AI analysis ensures your skills are accurately represented',
                    'Share your credential link on LinkedIn and job applications',
                    'Build a portable proof of your professional achievements'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sky-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="mt-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                  onClick={() => isConnected ? router.push('/upload') : connect({ connector: injected() })}
                >
                  Start Building Your Credential
                </Button>
              </div>
              <div className="p-8 md:p-12 bg-gradient-to-br from-sky-100 to-blue-100">
                <h2 className="text-3xl font-bold text-sky-900 mb-4">For Employers</h2>
                <ul className="space-y-4">
                  {[
                    'Instantly verify candidate credentials on-chain',
                    'View AI verification scores and detailed reports',
                    'Issue endorsements to validate employee skills',
                    'Reduce hiring risks with verified professional data'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sky-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="mt-6"
                  variant="outline"
                  onClick={() => router.push('/employer')}
                >
                  Verify Candidates
                </Button>
              </div>
            </div>
          </Card>
        </motion.section>
      </main>

      <footer className="border-t border-sky-200 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">dResume</span>
          </div>
          <p className="text-sky-600 text-sm">
            Built on Polygon Amoy Testnet. Decentralized resume verification for the future of work.
          </p>
        </div>
      </footer>
    </div>
  );
}