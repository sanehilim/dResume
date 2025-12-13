import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  name?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  credentialIds: number[];
  isEmployer: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  walletAddress: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String },
  email: { type: String },
  bio: { type: String },
  avatarUrl: { type: String },
  credentialIds: { type: [Number], default: [] },
  isEmployer: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
