import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Resume } from '@/lib/models/Resume';
import { Verification } from '@/lib/models/Verification';
import { User } from '@/lib/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { resumeId, walletAddress, credentialId, txHash } = body;

    if (!resumeId || !walletAddress || credentialId === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    resume.credentialId = credentialId;
    await resume.save();

    const verification = await Verification.findOne({ resumeId });
    if (verification) {
      verification.credentialId = credentialId;
      verification.txHash = txHash;
      await verification.save();
    }

    await User.updateOne(
      { walletAddress: walletAddress.toLowerCase() },
      { $addToSet: { credentialIds: credentialId } }
    );

    return NextResponse.json({ success: true, credentialId, txHash });
  } catch (error) {
    console.error('Error saving credential:', error);
    return NextResponse.json({ error: 'Failed to save credential' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const resumes = await Resume.find({
      walletAddress: walletAddress.toLowerCase(),
      credentialId: { $exists: true },
    }).sort({ createdAt: -1 });

    return NextResponse.json({ credentials: resumes });
  } catch (error) {
    console.error('Error fetching credentials:', error);
    return NextResponse.json({ error: 'Failed to fetch credentials' }, { status: 500 });
  }
}
