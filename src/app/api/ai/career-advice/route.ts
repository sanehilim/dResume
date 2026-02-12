import { NextRequest, NextResponse } from 'next/server';
import { generateCareerAdvice } from '@/lib/gemini';
import { aiRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await aiRateLimit(req);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many AI requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          }
        }
      );
    }

    const body = await req.json();
    const { resumeData } = body;

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data required' }, { status: 400 });
    }

    const advice = await generateCareerAdvice(resumeData);
    return NextResponse.json({ 
      success: true, 
      advice,
      rateLimit: {
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime,
      }
    });
  } catch (error) {
    console.error('Error generating career advice:', error);
    return NextResponse.json({ error: 'Failed to generate career advice' }, { status: 500 });
  }
}
