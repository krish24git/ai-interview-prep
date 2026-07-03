import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { groq } from "@/lib/groq";

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

    const prompt = `
Generate ${questions} technical interview questions.

Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}

Return ONLY JSON in this format:

[
  {
    "question": "..."
  }
]
`;

const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  temperature: 0.7,
});

const responseText = completion.choices[0].message.content || "";


    const parsedQuestions = JSON.parse(
      responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
    );

    const interview = await Interview.create({
      userId: decoded.id,
      role,
      experience,
      techStack: [],
      questions: parsedQuestions.map((item: { question: string }) => item.question),
    });

    return NextResponse.json({
      success: true,
      interviewId: interview._id,
      questions: interview.questions,
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