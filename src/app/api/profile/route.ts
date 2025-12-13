import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    return NextResponse.json({ profile: user || null });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress, ...profileData } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      { $set: { ...profileData, updatedAt: new Date() } },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ success: true, profile: user });
  } catch (error) {
    console.error('Profile save error:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
