import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Resume } from '@/lib/models/Resume';
import { Verification } from '@/lib/models/Verification';
import { verifyResume } from '@/lib/gemini';
import { uploadToIPFS } from '@/lib/pinata';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    console.log('Received verification request:', { resumeId: body.resumeId, walletAddress: body.walletAddress });
    
    const { resumeId, walletAddress } = body;

    if (!resumeId || !walletAddress) {
      console.error('Missing parameters:', { resumeId, walletAddress });
      return NextResponse.json({ error: 'Resume ID and wallet address required' }, { status: 400 });
    }

    console.log('Finding resume:', resumeId);
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      console.error('Resume not found:', resumeId);
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    if (resume.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      console.error('Wallet mismatch:', { expected: resume.walletAddress, received: walletAddress });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('Starting AI verification...');
    const verificationResult = await verifyResume({
      name: resume.name,
      email: resume.email,
      summary: resume.summary,
      education: resume.education,
      experience: resume.experience,
      skills: resume.skills,
      certifications: resume.certifications,
      projects: resume.projects,
      githubUrl: resume.githubUrl,
      linkedinUrl: resume.linkedinUrl,
    });

    const verificationData = {
      resumeId: resume._id,
      walletAddress: walletAddress.toLowerCase(),
      verificationResult,
      timestamp: new Date().toISOString(),
    };

    const ipfsHash = await uploadToIPFS(verificationData);

    const verification = await Verification.create({
      resumeId: resume._id,
      walletAddress: walletAddress.toLowerCase(),
      score: verificationResult.score,
      aiReport: JSON.stringify(verificationResult),
      skillsVerified: verificationResult.skillsAnalysis.map((s) => ({
        skill: s.skill,
        verified: s.verified,
        confidence: s.confidence,
        evidence: s.evidence,
      })),
      educationVerified: verificationResult.educationAnalysis,
      experienceVerified: verificationResult.experienceAnalysis,
      overallAssessment: verificationResult.overallAssessment,
      redFlags: verificationResult.redFlags,
      strengths: verificationResult.strengths,
      ipfsHash,
    });

    resume.verificationStatus = verificationResult.score >= 60 ? 'verified' : 'rejected';
    resume.verificationScore = verificationResult.score;
    resume.verificationReport = JSON.stringify(verificationResult);
    resume.ipfsHash = ipfsHash;
    await resume.save();

    return NextResponse.json({
      success: true,
      verification,
      ipfsHash,
      score: verificationResult.score,
    });
  } catch (error) {
    console.error('Error verifying resume:', error);
    return NextResponse.json({ error: 'Failed to verify resume' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get('resumeId');

    if (!resumeId) {
      return NextResponse.json({ error: 'Resume ID required' }, { status: 400 });
    }

    const verification = await Verification.findOne({ resumeId }).sort({ createdAt: -1 });
    if (!verification) {
      return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
    }

    return NextResponse.json({ verification });
  } catch (error) {
    console.error('Error fetching verification:', error);
    return NextResponse.json({ error: 'Failed to fetch verification' }, { status: 500 });
  }
}