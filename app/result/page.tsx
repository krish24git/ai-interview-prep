"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  id: number;
  question: string;
};

export default function ResultPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedQuestions = localStorage.getItem("questions");

    if (!storedQuestions) return;

    try {
      const parsed: Question[] = JSON.parse(storedQuestions);

      setQuestions(parsed);
      setAnswers(new Array(parsed.length).fill(""));
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (answers.length > 0) {
      setAnswer(answers[current] || "");
    }
  }, [current]);

  const nextQuestion = async () => {
    if (answer.trim() === "") {
      alert("Please write your answer before continuing.");
      return;
    }

    const updatedAnswers = [...answers];
    updatedAnswers[current] = answer;

    setAnswers(updatedAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions,
          answers: updatedAnswers,
        }),
      });

      const data = await res.json();

      console.log(data);

      if (!data.success) {
  alert(data.message);
  setLoading(false);
  return;
}

// Save report locally
localStorage.setItem(
  "report",
  JSON.stringify(data.report)
);

// Get interview ID
const interviewId = localStorage.getItem("interviewId");

// Save answers, score and feedback to MongoDB
if (interviewId) {
  const updateRes = await fetch(`/api/interview/${interviewId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      answers: updatedAnswers,
      score: data.report.overallScore,
      feedback: data.report.results,
    }),
  });

  const updateData = await updateRes.json();
  console.log("Interview Updated:", updateData);
}

router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Evaluation failed.");
      setLoading(false);
    }
  };

  const previousQuestion = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[current] = answer;
    setAnswers(updatedAnswers);

    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-2xl">
        Loading Questions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-5">

      <div className="bg-slate-800 w-full max-w-4xl rounded-xl p-8 shadow-xl">

        <h1 className="text-4xl text-center font-bold text-white mb-8">
          AI Interview
        </h1>

        <div className="flex justify-between items-center mb-6">
          <p className="text-blue-400 font-semibold text-lg">
            Question {current + 1} of {questions.length}
          </p>

          <p className="text-gray-300">
            {Math.round(((current + 1) / questions.length) * 100)}%
          </p>
        </div>

        <div className="bg-slate-700 rounded-lg p-6 text-white text-lg leading-8">
          {questions[current].question}
        </div>

        <textarea
          rows={8}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="mt-6 w-full rounded-lg bg-slate-900 border border-slate-600 p-4 text-white focus:outline-none focus:border-blue-500"
        />

        <div className="flex justify-between mt-8">

          <button
            onClick={previousQuestion}
            disabled={current === 0}
            className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 px-6 py-3 rounded-lg text-white"
          >
            Previous
          </button>

          <button
            onClick={nextQuestion}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-8 py-3 rounded-lg text-white"
          >
            {loading
              ? "Evaluating..."
              : current === questions.length - 1
              ? "Finish Interview"
              : "Next Question"}
          </button>

        </div>

      </div>

    </div>
  );
}