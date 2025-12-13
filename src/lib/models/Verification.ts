import mongoose, { Schema, Document } from 'mongoose';

export interface IVerification extends Document {
  resumeId: mongoose.Types.ObjectId;
  walletAddress: string;
  score: number;
  aiReport: string;
  skillsVerified: Array<{
    skill: string;
    verified: boolean;
    confidence: number;
    evidence?: string;
  }>;
  educationVerified: Array<{
    institution: string;
    verified: boolean;
    confidence: number;
  }>;
  experienceVerified: Array<{
    company: string;
    verified: boolean;
    confidence: number;
  }>;
  overallAssessment: string;
  redFlags: string[];
  strengths: string[];
  ipfsHash: string;
  txHash?: string;
  credentialId?: number;
  createdAt: Date;
}

const VerificationSchema = new Schema<IVerification>({
  resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
  walletAddress: { type: String, required: true, lowercase: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  aiReport: { type: String, required: true },
  skillsVerified: [{
    skill: String,
    verified: Boolean,
    confidence: Number,
    evidence: String,
  }],
  educationVerified: [{
    institution: String,
    verified: Boolean,
    confidence: Number,
  }],
  experienceVerified: [{
    company: String,
    verified: Boolean,
    confidence: Number,
  }],
  overallAssessment: { type: String, required: true },
  redFlags: [String],
  strengths: [String],
  ipfsHash: { type: String, required: true },
  txHash: String,
  credentialId: Number,
}, { timestamps: true });

export const Verification = mongoose.models.Verification || mongoose.model<IVerification>('Verification', VerificationSchema);
