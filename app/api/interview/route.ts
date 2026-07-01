import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { role, experience, difficulty, questions } = await req.json();

    const prompt = `
You are a senior technical interviewer.

Generate ${questions} ${difficulty} interview questions for a ${experience} ${role}.

Return ONLY valid JSON in this format:

{
  "questions":[
    {
      "id":1,
      "question":"Question text"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text();

    console.log("Gemini Raw Response:");
    console.log(text);

    // Remove markdown if Gemini returns ```json
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(text);

    console.log("Parsed Response:");
    console.log(parsed);

    return NextResponse.json({
      success: true,
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