import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
  explanation: String,
});

const TestSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    walletAddress: { type: String, required: true },
    skill: { type: String, required: true },
    questions: [QuestionSchema],
    answers: [Number],
    score: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    certificateCode: String,
    completedAt: Date,
  },
  { timestamps: true }
);

export const Test = mongoose.models.Test || mongoose.model('Test', TestSchema);
