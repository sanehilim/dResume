import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Resume } from '@/lib/models/Resume';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, query } = await req.json();

    if (!walletAddress || !query) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();
    
    const resume = await Resume.findOne({ 
      walletAddress: walletAddress.toLowerCase(),
      isVerified: true 
    }).sort({ createdAt: -1 });

    const mockJobs = [
      {
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        salary: '$150k - $200k',
        type: 'Full-time',
        description: 'We are looking for a senior software engineer to join our growing team. You will work on cutting-edge technologies and lead technical initiatives.',
        skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker']
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        salary: '$120k - $160k',
        type: 'Full-time',
        description: 'Join our fast-paced startup as a full stack developer. Build products that impact millions of users.',
        skills: ['JavaScript', 'Python', 'PostgreSQL', 'React', 'GraphQL']
      },
      {
        title: 'Frontend Engineer',
        company: 'Digital Agency',
        location: 'New York, NY',
        salary: '$100k - $140k',
        type: 'Full-time',
        description: 'Create stunning user interfaces for our enterprise clients. Work with modern frameworks and tools.',
        skills: ['React', 'Vue.js', 'CSS', 'Figma', 'TypeScript']
      },
      {
        title: 'Backend Developer',
        company: 'CloudTech',
        location: 'Austin, TX',
        salary: '$130k - $170k',
        type: 'Full-time',
        description: 'Build scalable backend systems that power our platform. Work with microservices and cloud technologies.',
        skills: ['Node.js', 'MongoDB', 'Redis', 'Kubernetes', 'Go']
      },
      {
        title: 'DevOps Engineer',
        company: 'Infrastructure Co',
        location: 'Seattle, WA',
        salary: '$140k - $180k',
        type: 'Full-time',
        description: 'Manage and automate our infrastructure. Build CI/CD pipelines and ensure system reliability.',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python']
      }
    ];

    const filteredJobs = mockJobs.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase())) ||
      job.company.toLowerCase().includes(query.toLowerCase())
    );

    let matchScores: Record<string, number> = {};

    if (resume) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        for (let i = 0; i < filteredJobs.length; i++) {
          const job = filteredJobs[i];
          const prompt = `
            Given this candidate's resume skills: ${resume.skills?.join(', ')}
            And this job requirements: ${job.title} - ${job.description}
            Required skills: ${job.skills.join(', ')}
            
            Calculate a match score from 0-100 based on skill overlap and relevance.
            Respond with ONLY a number between 0 and 100, nothing else.
          `;

          const result = await model.generateContent(prompt);
          const score = parseInt(result.response.text().trim()) || 75;
          matchScores[i] = Math.min(100, Math.max(0, score));
        }
      } catch (error) {
        console.error('AI matching error:', error);
        filteredJobs.forEach((_, i) => {
          matchScores[i] = 70 + Math.floor(Math.random() * 20);
        });
      }
    } else {
      filteredJobs.forEach((_, i) => {
        matchScores[i] = 65 + Math.floor(Math.random() * 25);
      });
    }

    const sortedJobs = filteredJobs
      .map((job, index) => ({ job, score: matchScores[index], originalIndex: index }))
      .sort((a, b) => b.score - a.score)
      .map(({ job, score, originalIndex }) => job);

    const sortedScores: Record<string, number> = {};
    sortedJobs.forEach((_, newIndex) => {
      const originalJob = filteredJobs.find(fj => fj.title === sortedJobs[newIndex].title);
      const originalIndex = filteredJobs.indexOf(originalJob!);
      sortedScores[newIndex] = matchScores[originalIndex];
    });

    return NextResponse.json({
      jobs: sortedJobs.slice(0, 10),
      matchScores: sortedScores
    });
  } catch (error) {
    console.error('Job matching error:', error);
    return NextResponse.json({ error: 'Failed to match jobs' }, { status: 500 });
  }
}
