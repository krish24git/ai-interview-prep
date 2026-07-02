import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  role: string;
  experience: number;
  techStack: string[];
  questions: string[];
  answers: string[];
  feedback: string;
  score: number;
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
    feedback: {
      type: String,
      default: "",
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Interview =
  models.Interview || model<IInterview>("Interview", InterviewSchema);

export default Interview;