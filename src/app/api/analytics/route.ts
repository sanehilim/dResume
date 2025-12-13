import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Resume } from '@/lib/models/Resume';
import { Verification } from '@/lib/models/Verification';
import { User } from '@/lib/models/User';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const resumes = await Resume.find({ walletAddress: walletAddress.toLowerCase() });
    const verifications = await Verification.find({ walletAddress: walletAddress.toLowerCase() });
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    const credentialCount = resumes.filter(r => r.isVerified).length;
    const avgScore = verifications.length > 0 
      ? verifications.reduce((sum, v) => sum + v.score, 0) / verifications.length 
      : 0;

    let profileStrength = 0;
    if (user?.name) profileStrength += 20;
    if (user?.email) profileStrength += 20;
    if (resumes.length > 0) profileStrength += 20;
    if (verifications.length > 0) profileStrength += 20;
    if (credentialCount > 0) profileStrength += 20;

    const recentActivity = [
      ...resumes.map(r => ({
        title: `Resume uploaded: ${r.name}`,
        timestamp: new Date(r.createdAt).toLocaleDateString()
      })),
      ...verifications.map(v => ({
        title: `Verification completed (${v.score}%)`,
        timestamp: new Date(v.createdAt).toLocaleDateString()
      }))
    ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
    
    return NextResponse.json({
      totalViews: Math.floor(Math.random() * 1000) + 100,
      verificationScore: Math.round(avgScore),
      credentialCount,
      endorsements: 0,
      profileStrength,
      recentActivity
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
