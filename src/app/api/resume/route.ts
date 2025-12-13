import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Resume } from '@/lib/models/Resume';
import { User } from '@/lib/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { walletAddress, ...resumeData } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      user = await User.create({ walletAddress: walletAddress.toLowerCase() });
    }

    const resume = await Resume.create({
      walletAddress: walletAddress.toLowerCase(),
      ...resumeData,
    });

    return NextResponse.json({ success: true, resume });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
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

    const resumes = await Resume.find({ walletAddress: walletAddress.toLowerCase() }).sort({ createdAt: -1 });
    return NextResponse.json({ resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}
