
'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Sparkles, Send, Loader2, Briefcase, TrendingUp, Target, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AIAssistantPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [careerAdvice, setCareerAdvice] = useState('');
  const [skillMatchLoading, setSkillMatchLoading] = useState(false);
  const [skillMatch, setSkillMatch] = useState<{
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
  } | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [resumes, setResumes] = useState<{ skills: string[]; name: string }[]>([]);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    const fetchResumes = async () => {
      try {
        const res = await fetch(`/api/resume?walletAddress=${address}`);
        const data = await res.json();
        if (data.resumes && data.resumes.length > 0) {
          setResumes(data.resumes);
          setUserSkills(data.resumes[0].skills || []);
        }
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };

    fetchResumes();
  }, [address, isConnected, router]);

  const getCareerAdvice = async () => {
    if (resumes.length === 0) {
      toast.error('Please upload a resume first');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ai/career-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: resumes[0] }),
      });

      const data = await res.json();
      if (data.success) {
        setCareerAdvice(data.advice);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to get career advice');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSkillMatch = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    if (userSkills.length === 0) {
      toast.error('No skills found. Please upload a resume first.');
      return;
    }

    setSkillMatchLoading(true);
    try {
      const res = await fetch('/api/ai/skill-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: userSkills, jobDescription }),
      });

      const data = await res.json();
      if (data.success) {
        setSkillMatch(data.analysis);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to analyze skill match');
      console.error(error);
    } finally {
      setSkillMatchLoading(false);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-sky-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-sky-500" />
            AI Career Assistant
          </h1>
          <p className="text-sky-600">Get personalized career advice powered by AI</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="glass-card border-sky-200">
            <CardHeader>
              <CardTitle className="text-sky-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sky-500" />
                Career Advice
              </CardTitle>
              <CardDescription className="text-sky-600">
                Get personalized career recommendations based on your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resumes.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-sky-300 mx-auto mb-3" />
                  <p className="text-sky-600 mb-4">Upload a resume to get personalized advice</p>
                  <Button onClick={() => router.push('/upload')} variant="outline" className="border-sky-300 text-sky-700">
                    Upload Resume
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    onClick={getCareerAdvice}
                    disabled={loading}
                    className="w-full mb-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating advice...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get Career Advice
                      </>
                    )}
                  </Button>
                  
                  {careerAdvice && (
                    <div className="p-4 bg-sky-50 rounded-lg">
                      <div className="prose prose-sky text-sm text-sky-700 whitespace-pre-wrap">
                        {careerAdvice}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-sky-200">
            <CardHeader>
              <CardTitle className="text-sky-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-sky-500" />
                Job Match Analysis
              </CardTitle>
              <CardDescription className="text-sky-600">
                See how well your skills match a job description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-sky-600 mb-2">Your Skills:</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {userSkills.length > 0 ? (
                      userSkills.map((skill, i) => (
                        <Badge key={i} className="bg-sky-100 text-sky-700 text-xs">{skill}</Badge>
                      ))
                    ) : (
                      <span className="text-sky-400 text-sm">No skills found</span>
                    )}
                  </div>
                </div>
                
                <Textarea 
                  placeholder="Paste job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={5}
                  className="border-sky-200 focus:border-sky-400"
                />
                
                <Button 
                  onClick={analyzeSkillMatch}
                  disabled={skillMatchLoading || !jobDescription.trim()}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                >
                  {skillMatchLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Analyze Match
                    </>
                  )}
                </Button>

                {skillMatch && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between p-4 bg-sky-50 rounded-lg">
                      <span className="text-sky-600">Match Score</span>
                      <span className={`text-2xl font-bold ${
                        skillMatch.matchScore >= 70 ? 'text-green-600' : 
                        skillMatch.matchScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {skillMatch.matchScore}%
                      </span>
                    </div>

                    {skillMatch.matchedSkills.length > 0 && (
                      <div>
                        <p className="text-sm text-sky-600 mb-2">Matched Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {skillMatch.matchedSkills.map((skill, i) => (
                            <Badge key={i} className="bg-green-100 text-green-700 text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {skillMatch.missingSkills.length > 0 && (
                      <div>
                        <p className="text-sm text-sky-600 mb-2">Skills to Develop:</p>
                        <div className="flex flex-wrap gap-1">
                          {skillMatch.missingSkills.map((skill, i) => (
                            <Badge key={i} className="bg-red-100 text-red-700 text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {skillMatch.recommendations.length > 0 && (
                      <div className="p-4 bg-sky-50 rounded-lg">
                        <p className="text-sm font-medium text-sky-700 mb-2">Recommendations:</p>
                        <ul className="space-y-1">
                          {skillMatch.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-sky-600 flex items-start gap-2">
                              <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
