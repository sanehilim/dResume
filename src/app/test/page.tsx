'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Brain, CheckCircle, XCircle, Award, Download, 
  Loader2, AlertCircle, Trophy, ExternalLink 
} from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function TestPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [testId, setTestId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
    verificationCode?: string;
  } | null>(null);

  const startTest = async () => {
    if (!skill.trim() || !isConnected) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', walletAddress: address, skill }),
      });
      
      const data = await res.json();
      if (data.success) {
        setTestId(data.testId);
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(-1));
        toast.success('Test started! Good luck!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to start test');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer');
      return;
    }
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitTest(newAnswers);
    }
  };

  const submitTest = async (finalAnswers: number[]) => {
    setLoading(true);
    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'submit', 
          testId, 
          answers: finalAnswers,
          walletAddress: address,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setResult(data);
        setShowResult(true);
        
        if (data.passed) {
          toast.success(`Congratulations! You passed with ${data.score}%`);
        } else {
          toast.error(`Score: ${data.score}%. You need 60% to pass.`);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to submit test');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = () => {
    router.push(`/certificate?code=${result?.verificationCode}`);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-sky-900 mb-2">Connect Your Wallet</h2>
          <p className="text-sky-600">Please connect your wallet to take a skill test</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-sky-900 mb-2">Skill Test</h1>
          <p className="text-sky-600">Test your knowledge and earn a certificate</p>
        </motion.div>

        {!testId && !showResult && (
          <Card className="glass-card border-sky-200">
            <CardHeader>
              <CardTitle className="text-sky-900 flex items-center gap-2">
                <Brain className="w-6 h-6" />
                Start Your Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sky-700 mb-2">
                  What skill do you want to test?
                </label>
                <Input
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="e.g., React, Python, Data Structures, etc."
                  className="max-w-md"
                />
              </div>
              <div className="bg-sky-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sky-900 mb-2">Test Details:</h4>
                <ul className="space-y-1 text-sm text-sky-700">
                  <li>• 10 multiple choice questions</li>
                  <li>• Questions generated by AI based on your skill</li>
                  <li>• 60% score required to pass</li>
                  <li>• Get a certificate with verification code if you pass</li>
                </ul>
              </div>
              <Button
                onClick={startTest}
                disabled={loading || !skill.trim()}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  'Start Test'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {testId && !showResult && questions.length > 0 && (
          <div className="space-y-6">
            <Card className="glass-card border-sky-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <Badge className="bg-sky-100 text-sky-700">
                    Question {currentQuestion + 1} of {questions.length}
                  </Badge>
                  <span className="text-sm text-sky-600">
                    Progress: {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mb-6" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-sky-900 mb-6">
                      {questions[currentQuestion].question}
                    </h3>
                    
                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswer(idx)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selectedAnswer === idx
                              ? 'border-sky-500 bg-sky-50'
                              : 'border-sky-200 hover:border-sky-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswer === idx
                                ? 'border-sky-500 bg-sky-500'
                                : 'border-sky-300'
                            }`}>
                              {selectedAnswer === idx && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className="text-sky-900">{option}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={nextQuestion}
                    disabled={selectedAnswer === null || loading}
                    className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                  >
                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit Test'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showResult && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className={`glass-card ${result.passed ? 'border-green-300' : 'border-red-300'}`}>
              <CardContent className="py-12 text-center">
                {result.passed ? (
                  <Trophy className="w-20 h-20 text-green-500 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                )}
                
                <h2 className="text-3xl font-bold text-sky-900 mb-2">
                  {result.passed ? 'Congratulations!' : 'Test Not Passed'}
                </h2>
                
                <p className="text-lg text-sky-700 mb-6">
                  You scored <span className="font-bold text-2xl">{result.score}%</span>
                </p>
                
                <div className="flex justify-center gap-8 mb-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{result.correctCount}</p>
                    <p className="text-sm text-sky-600">Correct</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">
                      {result.totalQuestions - result.correctCount}
                    </p>
                    <p className="text-sm text-sky-600">Incorrect</p>
                  </div>
                </div>

                {result.passed && result.verificationCode && (
                  <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-lg mb-6">
                    <h3 className="font-semibold text-sky-900 mb-2">Verification Code</h3>
                    <p className="text-2xl font-mono font-bold text-sky-700 mb-2">
                      {result.verificationCode}
                    </p>
                    <p className="text-sm text-sky-600">
                      Save this code to verify your certificate
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {result.passed && (
                    <Button
                      onClick={downloadCertificate}
                      className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      View Certificate
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTestId(null);
                      setQuestions([]);
                      setCurrentQuestion(0);
                      setAnswers([]);
                      setSelectedAnswer(null);
                      setShowResult(false);
                      setResult(null);
                      setSkill('');
                    }}
                  >
                    Take Another Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
