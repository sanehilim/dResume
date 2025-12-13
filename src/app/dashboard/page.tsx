'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Award, TrendingUp, Plus, Eye, ExternalLink, User, BarChart3, Building2, Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ResumeData {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationScore?: number;
  credentialId?: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    const fetchResumes = async () => {
      try {
        const res = await fetch(`/api/resume?walletAddress=${address}`);
        const data = await res.json();
        setResumes(data.resumes || []);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [address, isConnected, router]);

  const stats = [
    { label: 'Total Resumes', value: resumes.length, icon: FileText, color: 'bg-sky-500' },
    { label: 'Verified', value: resumes.filter(r => r.verificationStatus === 'verified').length, icon: Shield, color: 'bg-green-500' },
    { label: 'On-Chain Credentials', value: resumes.filter(r => r.credentialId).length, icon: Award, color: 'bg-purple-500' },
    { label: 'Avg Score', value: resumes.length ? Math.round(resumes.filter(r => r.verificationScore).reduce((acc, r) => acc + (r.verificationScore || 0), 0) / resumes.filter(r => r.verificationScore).length) || 0 : 0, icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const quickActions = [
    {
      title: 'Profile',
      description: 'Manage your profile, links, and personal information',
      icon: User,
      color: 'from-blue-500 to-cyan-500',
      href: '/profile'
    },
    {
      title: 'AI Verification',
      description: 'Start AI-powered resume verification process',
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      href: '/verify'
    },
    {
      title: 'Analytics',
      description: 'View profile views, scores, and activity trends',
      icon: BarChart3,
      color: 'from-purple-500 to-pink-500',
      href: '/analytics'
    },
    {
      title: 'Job Matching',
      description: 'AI-powered job recommendations based on your skills',
      icon: Building2,
      color: 'from-orange-500 to-red-500',
      href: '/jobs'
    },
    {
      title: 'AI Assistant',
      description: 'Get career advice and skill gap analysis',
      icon: Sparkles,
      color: 'from-yellow-500 to-amber-500',
      href: '/ai-assistant'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
    }
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
          <h1 className="text-3xl font-bold text-sky-900 mb-2">Dashboard</h1>
          <p className="text-sky-600">Manage your resumes and credentials</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-sky-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-sky-900">{stat.value}</p>
                      <p className="text-sm text-sky-600">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card 
                  className="glass-card border-sky-200 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => router.push(action.href)}
                >
                  <CardContent className="p-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-sky-900 mb-1">{action.title}</h3>
                    <p className="text-xs text-sky-600 mb-3">{action.description}</p>
                    <div className="flex items-center text-xs text-sky-500 group-hover:text-sky-700 transition-colors">
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-sky-900">Your Resumes</h2>
          <Button 
            onClick={() => router.push('/upload')}
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload New Resume
          </Button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-card border-sky-200 animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-sky-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-sky-100 rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-sky-100 rounded mb-2" />
                  <div className="h-4 bg-sky-100 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <Card className="glass-card border-sky-200 text-center py-12">
            <CardContent>
              <FileText className="w-16 h-16 text-sky-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-sky-900 mb-2">No Resumes Yet</h3>
              <p className="text-sky-600 mb-6">Upload your first resume to get started with verification</p>
              <Button 
                onClick={() => router.push('/upload')}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-sky-200 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sky-900">{resume.name}</CardTitle>
                        <CardDescription className="text-sky-600">{resume.email}</CardDescription>
                      </div>
                      {getStatusBadge(resume.verificationStatus)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resume.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-sky-100 text-sky-700">
                          {skill}
                        </Badge>
                      ))}
                      {resume.skills.length > 4 && (
                        <Badge variant="secondary" className="bg-sky-100 text-sky-700">
                          +{resume.skills.length - 4}
                        </Badge>
                      )}
                    </div>

                    {resume.verificationScore !== undefined && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-sky-600">Verification Score</span>
                          <span className="font-semibold text-sky-900">{resume.verificationScore}%</span>
                        </div>
                        <div className="h-2 bg-sky-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${resume.verificationScore >= 60 ? 'bg-green-500' : 'bg-yellow-500'}`}
                            style={{ width: `${resume.verificationScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {resume.credentialId && (
                      <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
                        <Award className="w-4 h-4" />
                        <span>Credential #{resume.credentialId}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 border-sky-300 text-sky-700 hover:bg-sky-100"
                        onClick={() => router.push(`/verify?resumeId=${resume._id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {resume.verificationStatus === 'pending' ? 'Verify' : 'View'}
                      </Button>
                      {resume.credentialId && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-sky-300 text-sky-700 hover:bg-sky-100"
                          onClick={() => router.push(`/credentials?id=${resume.credentialId}`)}
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
      </main>
    </div>
  );
}