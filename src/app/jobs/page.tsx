'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Briefcase, MapPin, DollarSign, Clock, Sparkles, ExternalLink, Loader2 } from 'lucide-react';

export default function JobsPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [matchScores, setMatchScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }
  }, [isConnected]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !address) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/jobs/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          query: searchQuery
        })
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
        setMatchScores(data.matchScores || {});
      }
    } catch (error) {
      console.error('Job search error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return null;

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
            <h1 className="text-4xl font-bold gradient-text mb-2">AI Job Matching</h1>
            <p className="text-sky-600">Find jobs that match your verified skills</p>
          </div>

          <Card className="glass-card border-sky-200 mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search for job titles, skills, or companies..."
                    className="pl-10 bg-white border-sky-200"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Match
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card border-sky-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sky-900 mb-1">{job.title}</CardTitle>
                          <CardDescription className="text-sky-600">{job.company}</CardDescription>
                        </div>
                        {matchScores[index] && (
                          <div className="flex flex-col items-end">
                            <div className="px-3 py-1 rounded-full bg-green-100 border border-green-200">
                              <span className="text-green-700 font-semibold text-sm">
                                {matchScores[index]}% Match
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sky-700">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-sky-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </div>
                        </div>

                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-3 border-t border-sky-200">
                            {job.skills.map((skill: string, i: number) => (
                              <span
                                key={i}
                                className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-3 pt-3">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Apply Now
                          </Button>
                          <Button size="sm" variant="outline" className="border-sky-300 text-sky-700">
                            Save Job
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : searchQuery ? (
            <Card className="glass-card border-sky-200">
              <CardContent className="py-12 text-center">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-sky-400" />
                <p className="text-sky-600">No jobs found. Try different keywords.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card border-sky-200">
              <CardContent className="py-12 text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-sky-400" />
                <p className="text-sky-600 mb-2">Search for jobs and let AI match them with your verified skills</p>
                <p className="text-sm text-sky-500">Try searching for "Software Engineer", "Product Designer", or any job title</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
}
