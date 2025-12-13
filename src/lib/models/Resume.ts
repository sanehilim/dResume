import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  walletAddress: string;
  name: string;
  email: string;
  phone?: string;
  summary?: string;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  experience?: Array<{
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    githubUrl?: string;
  }>;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  ipfsHash?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationScore?: number;
  verificationReport?: string;
  credentialId?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>({
  walletAddress: { type: String, required: true, lowercase: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  summary: { type: String },
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    gpa: String,
  }],
  experience: [{
    company: String,
    title: String,
    location: String,
    startDate: String,
    endDate: String,
    description: String,
  }],
  skills: [String],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    url: String,
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    url: String,
    githubUrl: String,
  }],
  linkedinUrl: String,
  githubUrl: String,
  portfolioUrl: String,
  ipfsHash: String,
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  verificationScore: Number,
  verificationReport: String,
  credentialId: Number,
}, { timestamps: true });

export const Resume = mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);