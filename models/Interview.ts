import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  role: string;
  experience: string;
  techStack: string[];
  questions: string[];
  answers: string[];

  score: number;
  feedback: string;

  communication: number;
  technicalKnowledge: number;
  problemSolving: number;
  confidence: number;

  strengths: string[];
  improvements: string[];

  status: string;

  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    techStack: {
      type: [String],
      default: [],
    },

    questions: {
      type: [String],
      default: [],
    },

    answers: {
      type: [String],
      default: [],
    },

    score: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: String,
      default: "",
    },

    communication: {
      type: Number,
      default: 0,
    },

    technicalKnowledge: {
      type: Number,
      default: 0,
    },

    problemSolving: {
      type: Number,
      default: 0,
    },

    confidence: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Interview =
  models.Interview || model<IInterview>("Interview", InterviewSchema);

export default Interview;