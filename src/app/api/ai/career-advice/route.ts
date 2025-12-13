import { NextRequest, NextResponse } from 'next/server';
import { generateCareerAdvice } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeData } = body;

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data required' }, { status: 400 });
    }

    const advice = await generateCareerAdvice(resumeData);
    return NextResponse.json({ success: true, advice });
  } catch (error) {
    console.error('Error generating career advice:', error);
    return NextResponse.json({ error: 'Failed to generate career advice' }, { status: 500 });
  }
}
