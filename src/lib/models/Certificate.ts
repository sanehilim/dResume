import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema(
  {
    walletAddress: { type: String, required: true, lowercase: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    skill: { type: String, required: true },
    score: { type: Number, required: true },
    verificationCode: { type: String, required: true, unique: true },
    ipfsHash: String,
    credentialId: Number,
    txHash: String,
  },
  { timestamps: true }
);

CertificateSchema.index({ verificationCode: 1 });
CertificateSchema.index({ walletAddress: 1 });

export const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
