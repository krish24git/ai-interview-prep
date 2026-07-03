import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const {
      role,
      experience,
      difficulty,
      questions,
      answers,
    } = await req.json();

    const prompt = `
You are a senior technical interviewer.

Evaluate every answer individually.

Job Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}

Questions:
${JSON.stringify(questions)}

Answers:
${JSON.stringify(answers)}

For EACH question give:
- score out of 10
- short feedback

Also give:
- overallScore (0-100)
- technicalKnowledge (0-10)
- communication (0-10)
- problemSolving (0-10)
- confidence (0-10)
- overall feedback
- strengths
- improvements

Return ONLY valid JSON.

{
  "overallScore": 85,
  "technicalKnowledge": 8,
  "communication": 9,
  "problemSolving": 8,
  "confidence": 8,
  "feedback": "Overall detailed feedback",
  "strengths": [
    "Point 1",
    "Point 2"
  ],
  "improvements": [
    "Point 1",
    "Point 2"
  ],
  "questionAnalysis": [
    {
      "question": "Question text",
      "answer": "Candidate answer",
      "score": 8,
      "feedback": "Good answer with minor improvements."
    }
  ]
}
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

    const text = completion.choices[0].message.content || "";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const evaluation = JSON.parse(cleaned);

    return NextResponse.json(evaluation);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Evaluation failed",
      },
      { status: 500 }
    );
  }
}