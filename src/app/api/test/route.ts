import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Test } from '@/lib/models/Test';
import { Certificate } from '@/lib/models/Certificate';
import { generateMCQQuestions } from '@/lib/gemini';
import { uploadToIPFS } from '@/lib/pinata';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { action, walletAddress, skill, testId, answers } = body;

    if (action === 'start') {
      if (!walletAddress || !skill) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const questions = await generateMCQQuestions(skill);

      const test = await Test.create({
        userId: walletAddress,
        walletAddress: walletAddress.toLowerCase(),
        skill,
        questions,
        answers: [],
      });

      return NextResponse.json({ success: true, testId: test._id, questions });
    }

    if (action === 'submit') {
      if (!testId || !answers || !walletAddress) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const test = await Test.findById(testId);
      if (!test) {
        return NextResponse.json({ error: 'Test not found' }, { status: 404 });
      }

      if (test.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      let correctCount = 0;
      test.questions.forEach((q, idx) => {
        if (q.correctAnswer === answers[idx]) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / test.questions.length) * 100);
      const passed = score >= 60;

      test.answers = answers;
      test.score = score;
      test.passed = passed;
      test.completedAt = new Date();
      await test.save();

      let certificate = null;
      let verificationCode = null;

      if (passed) {
        verificationCode = crypto.randomBytes(8).toString('hex').toUpperCase();

        const certData = {
          walletAddress: test.walletAddress,
          skill: test.skill,
          score,
          verificationCode,
          date: new Date().toISOString(),
        };

        const ipfsHash = await uploadToIPFS(certData);

        certificate = await Certificate.create({
          walletAddress: test.walletAddress,
          testId: test._id,
          skill: test.skill,
          score,
          verificationCode,
          ipfsHash,
        });

        test.certificateCode = verificationCode;
        await test.save();
      }

      return NextResponse.json({
        success: true,
        score,
        passed,
        correctCount,
        totalQuestions: test.questions.length,
        certificate,
        verificationCode,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling test:', error);
    return NextResponse.json({ error: 'Failed to process test' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const testId = searchParams.get('testId');
    const walletAddress = searchParams.get('walletAddress');

    if (testId) {
      const test = await Test.findById(testId);
      if (!test) {
        return NextResponse.json({ error: 'Test not found' }, { status: 404 });
      }
      return NextResponse.json({ test });
    }

    if (walletAddress) {
      const tests = await Test.find({ walletAddress: walletAddress.toLowerCase() }).sort({ createdAt: -1 });
      return NextResponse.json({ tests });
    }

    return NextResponse.json({ error: 'Test ID or wallet address required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching test:', error);
    return NextResponse.json({ error: 'Failed to fetch test' }, { status: 500 });
  }
}
