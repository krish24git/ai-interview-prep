import { NextResponse } from "next/server";

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
const report = {
  overallScore: 82,
  results: questions.map((question: any, index: number) => ({
    question:
      typeof question === "string"
        ? question
        : question.question || `Question ${index + 1}`,

    answer: answers[index] || "No answer provided",

    score: Math.floor(Math.random() * 3) + 7, // Random score 7–9

    feedback:
      "Good answer. Try to explain your approach with more practical examples and mention best practices.",
  })),
};
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