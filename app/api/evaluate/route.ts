import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { questions, answers } = await req.json();

    const prompt = `
You are a Senior Full Stack Developer Interviewer.

Evaluate the candidate's interview.

Questions:
${JSON.stringify(questions, null, 2)}

Answers:
${JSON.stringify(answers, null, 2)}

Return ONLY valid JSON in this format:

{
  "overallScore": 45,
  "results": [
    {
      "question": "...",
      "answer": "...",
      "score": 8,
      "feedback": "Good answer but mention Virtual DOM."
    }
  ]
}

Do not return markdown.
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text();

    console.log("Gemini Evaluation:");
    console.log(text);

    // Remove markdown fences if present
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const report = JSON.parse(text);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Evaluation failed",
      },
      { status: 500 }
    );
  }
}