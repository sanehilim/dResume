const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

export interface VerificationResult {
  score: number;
  overallAssessment: string;
  skillsAnalysis: Array<{
    skill: string;
    verified: boolean;
    confidence: number;
    evidence: string;
  }>;
  educationAnalysis: Array<{
    institution: string;
    verified: boolean;
    confidence: number;
  }>;
  experienceAnalysis: Array<{
    company: string;
    verified: boolean;
    confidence: number;
  }>;
  redFlags: string[];
  strengths: string[];
  recommendations: string[];
}

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

export async function verifyResume(resumeData: {
  name: string;
  email?: string;
  summary?: string;
  education?: Array<{ institution: string; degree: string; field: string; startDate: string; endDate: string }>;
  experience?: Array<{ company: string; title: string; description: string; startDate: string; endDate: string }>;
  skills?: string[];
  certifications?: Array<{ name: string; issuer: string; date: string }>;
  projects?: Array<{ name: string; description: string; technologies: string[]; githubUrl?: string }>;
  githubUrl?: string;
  linkedinUrl?: string;
}): Promise<VerificationResult> {
  const prompt = `You are an expert resume verifier and career analyst. Analyze the following resume data and provide a comprehensive verification report.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Analyze this resume and provide a JSON response with the following structure:
{
  "score": <number between 0-100 representing overall credibility>,
  "overallAssessment": "<detailed assessment of the resume's authenticity and quality>",
  "skillsAnalysis": [
    {
      "skill": "<skill name>",
      "verified": <boolean>,
      "confidence": <number 0-100>,
      "evidence": "<explanation of how this skill was verified or why it couldn't be>"
    }
  ],
  "educationAnalysis": [
    {
      "institution": "<institution name>",
      "verified": <boolean>,
      "confidence": <number 0-100>
    }
  ],
  "experienceAnalysis": [
    {
      "company": "<company name>",
      "verified": <boolean>,
      "confidence": <number 0-100>
    }
  ],
  "redFlags": ["<any concerning patterns or inconsistencies>"],
  "strengths": ["<notable positive aspects of the resume>"],
  "recommendations": ["<suggestions for improvement>"]
}

Consider:
1. Consistency between skills, projects, and experience
2. Timeline coherence (no overlapping dates, logical progression)
3. Specificity of descriptions (vague claims vs. concrete achievements)
4. Technical accuracy (skills match described work)
5. Common red flags (employment gaps, unrealistic claims, buzzword stuffing)

Respond ONLY with the JSON object, no additional text.`;

  try {
    const text = await callGemini(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');
    return JSON.parse(jsonMatch[0]) as VerificationResult;
  } catch (error) {
    console.error('Error verifying resume:', error);
    throw new Error('Failed to verify resume');
  }
}

export async function generateCareerAdvice(resumeData: unknown): Promise<string> {
  const prompt = `As a career advisor, analyze this resume and provide personalized career advice:

${JSON.stringify(resumeData, null, 2)}

Provide advice on:
1. Skill gaps to address
2. Career path recommendations
3. Industry trends to consider
4. Networking suggestions
5. Learning resources

Keep the response concise and actionable.`;

  return await callGemini(prompt);
}

export async function analyzeSkillMatch(resumeSkills: string[], jobDescription: string): Promise<{
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}> {
  const prompt = `Analyze the match between these candidate skills and job requirements:

Candidate Skills: ${resumeSkills.join(', ')}

Job Description: ${jobDescription}

Respond with JSON:
{
  "matchScore": <0-100>,
  "matchedSkills": ["<matching skills>"],
  "missingSkills": ["<required but missing skills>"],
  "recommendations": ["<how to improve match>"]
}

Respond ONLY with JSON.`;

  const text = await callGemini(prompt);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid response');
  return JSON.parse(jsonMatch[0]);
}

export async function generateMCQQuestions(skill: string): Promise<Array<{
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}>> {
  const prompt = `Generate 10 multiple choice questions to test knowledge of: ${skill}

Requirements:
- Each question should have 4 options
- Questions should range from beginner to advanced difficulty
- Include practical scenarios where applicable
- Provide clear explanations for correct answers

Respond ONLY with JSON in this exact format:
{
  "questions": [
    {
      "question": "<question text>",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": <0-3 index of correct option>,
      "explanation": "<why this answer is correct>"
    }
  ]
}`;

  try {
    const text = await callGemini(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.questions;
  } catch (error) {
    console.error('Error generating MCQ questions:', error);
    throw new Error('Failed to generate questions');
  }
}