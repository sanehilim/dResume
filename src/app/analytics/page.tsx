'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Eye, Award, Users, BarChart3, Activity, 
  CheckCircle, Clock, Loader2 
} from 'lucide-react';

export default function AnalyticsPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    verificationScore: 0,
    credentialCount: 0,
    endorsements: 0,
    profileStrength: 0,
    recentActivity: []
  });

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }
    loadAnalytics();
  }, [isConnected, address]);

  const loadAnalytics = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?walletAddress=${address}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return null;

  const stats = [
    {
      icon: Eye,
      title: 'Profile Views',
      value: analytics.totalViews,
      trend: '+12%',
      color: 'from-sky-400 to-blue-500'
    },
    {
      icon: Award,
      title: 'Verification Score',
      value: `${analytics.verificationScore}%`,
      trend: '+5%',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      icon: CheckCircle,
      title: 'Credentials',
      value: analytics.credentialCount,
      trend: '+2',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Endorsements',
      value: analytics.endorsements,
      trend: '+3',
      color: 'from-purple-400 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">Analytics Dashboard</h1>
            <p className="text-sky-600">Track your credential performance</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-card border-sky-200 overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-sky-900">{stat.value}</CardTitle>
                        <CardDescription className="text-sky-600">{stat.title}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 font-medium">{stat.trend}</span>
                          <span className="text-sky-500">vs last month</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="glass-card border-sky-200">
                  <CardHeader>
                    <CardTitle className="text-sky-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Profile Strength
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-sky-600">Overall Strength</span>
                          <span className="text-sky-900 font-medium">{analytics.profileStrength}%</span>
                        </div>
                        <div className="w-full h-3 bg-sky-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${analytics.profileStrength}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-4 border-t border-sky-200">
                        {[
                          { label: 'Basic Info', complete: true },
                          { label: 'Resume Uploaded', complete: true },
                          { label: 'AI Verified', complete: analytics.verificationScore > 0 },
                          { label: 'Credential Minted', complete: analytics.credentialCount > 0 },
                          { label: 'Endorsements', complete: analytics.endorsements > 0 }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              item.complete ? 'bg-green-100' : 'bg-sky-100'
                            }`}>
                              {item.complete ? (
                                <CheckCircle className="w-3 h-3 text-green-600" />
                              ) : (
                                <Clock className="w-3 h-3 text-sky-400" />
                              )}
                            </div>
                            <span className={item.complete ? 'text-sky-700' : 'text-sky-400'}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-sky-200">
                  <CardHeader>
                    <CardTitle className="text-sky-900 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.recentActivity.length === 0 ? (
                        <p className="text-sky-500 text-center py-8">No recent activity</p>
                      ) : (
                        analytics.recentActivity.map((activity: any, i: number) => (
                          <div key={i} className="flex items-start gap-3 pb-3 border-b border-sky-100 last:border-0">
                            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                              <Activity className="w-4 h-4 text-sky-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-sky-700 font-medium">{activity.title}</p>
                              <p className="text-xs text-sky-500">{activity.timestamp}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
