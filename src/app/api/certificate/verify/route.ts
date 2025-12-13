import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Certificate } from '@/lib/models/Certificate';
import { Test } from '@/lib/models/Test';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Verification code required' }, { status: 400 });
    }

    const certificate = await Certificate.findOne({ 
      verificationCode: code.toUpperCase() 
    }).populate('testId');

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found', valid: false }, { status: 404 });
    }

    const test = await Test.findById(certificate.testId);

    return NextResponse.json({
      valid: true,
      certificate: {
        walletAddress: certificate.walletAddress,
        skill: certificate.skill,
        score: certificate.score,
        verificationCode: certificate.verificationCode,
        issuedAt: certificate.createdAt,
        ipfsHash: certificate.ipfsHash,
      },
      test: {
        totalQuestions: test?.questions.length || 10,
        correctAnswers: Math.round((certificate.score / 100) * (test?.questions.length || 10)),
        completedAt: test?.completedAt,
      },
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json({ error: 'Failed to verify certificate' }, { status: 500 });
  }
}
