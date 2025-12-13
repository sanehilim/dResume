import { NextRequest, NextResponse } from 'next/server';
import { analyzeSkillMatch } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { skills, jobDescription } = body;

    if (!skills || !jobDescription) {
      return NextResponse.json({ error: 'Skills and job description required' }, { status: 400 });
    }

    const analysis = await analyzeSkillMatch(skills, jobDescription);
    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error('Error analyzing skill match:', error);
    return NextResponse.json({ error: 'Failed to analyze skill match' }, { status: 500 });
  }
}
