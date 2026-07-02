import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { role, experience, difficulty, questions } = await req.json();

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      email: string;
    };

    const parsed = {
      questions: [
        {
          id: 1,
          question: `Tell me about yourself as a ${role}.`,
        },
        {
          id: 2,
          question: `Explain your experience with ${role}.`,
        },
        {
          id: 3,
          question: "What are the advantages of React?",
        },
        {
          id: 4,
          question: "Explain event loop in JavaScript.",
        },
        {
          id: 5,
          question: "How would you optimize a web application?",
        },
      ],
    };

    const interview = await Interview.create({
      userId: decoded.id,
      role,
      experience,
      techStack: [],
      questions: parsed.questions.map((q: any) => q.question),
      answers: [],
      feedback: "",
      score: 0,
    });

    return NextResponse.json({
      success: true,
      interviewId: interview._id,
      questions: parsed.questions,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate interview.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      email: string;
    };

    const interviews = await Interview.find({
      userId: decoded.id,
    })
      .select("_id role experience score createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch interviews",
      },
      { status: 500 }
    );
  }
}