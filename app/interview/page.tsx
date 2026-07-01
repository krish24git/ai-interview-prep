"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  id: number;
  question: string;
};

export default function InterviewPage() {
  const router = useRouter();

  const [role, setRole] = useState("Full Stack Developer");
  const [experience, setExperience] = useState("Fresher");
  const [difficulty, setDifficulty] = useState("Easy");
  const [questions, setQuestions] = useState("5");
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          experience,
          difficulty,
          questions,
        }),
      });

      const data = await res.json();

      console.log("Interview API Response:", data);

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to generate interview.");
        setLoading(false);
        return;
      }

      // Save COMPLETE question objects
      const generatedQuestions: Question[] = data.questions;

      console.log("Questions:", generatedQuestions);

      localStorage.setItem(
        "questions",
        JSON.stringify(generatedQuestions)
      );

      router.push("/result");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-[450px]">

        <h1 className="text-3xl font-bold text-center text-white mb-6">
          AI Interview
        </h1>

        <div className="mb-4">
          <label className="text-white font-medium">Job Role</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mt-2 p-3 rounded bg-slate-700 text-white"
          >
            <option>Full Stack Developer</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>React Developer</option>
            <option>Node.js Developer</option>
            <option>Python Developer</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="text-white font-medium">Experience</label>

          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full mt-2 p-3 rounded bg-slate-700 text-white"
          >
            <option>Fresher</option>
            <option>0-1 Years</option>
            <option>1-3 Years</option>
            <option>3-5 Years</option>
            <option>5+ Years</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="text-white font-medium">Difficulty</label>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full mt-2 p-3 rounded bg-slate-700 text-white"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="text-white font-medium">Number of Questions</label>

          <select
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            className="w-full mt-2 p-3 rounded bg-slate-700 text-white"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white py-3 rounded-lg"
        >
          {loading ? "Generating..." : "Start Interview"}
        </button>

      </div>
    </div>
  );
}