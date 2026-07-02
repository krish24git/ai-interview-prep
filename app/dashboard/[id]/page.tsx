"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function InterviewDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInterview() {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        router.push("/login");
        return;
      }

      const res = await fetch(`/api/interview/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setInterview(data.interview);
      } else {
        alert(data.message || "Failed to load interview.");
      }

      setLoading(false);
    }

    if (id) {
      fetchInterview();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Interview not found.
      </div>
    );
  }

  let feedback = [];

  try {
    feedback =
      typeof interview.feedback === "string"
        ? JSON.parse(interview.feedback)
        : interview.feedback;
  } catch {
    feedback = [];
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">

      <h1 className="text-4xl font-bold mb-6">
        Interview Report
      </h1>

      <div className="bg-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold">
          {interview.role}
        </h2>

        <p className="mt-2">
          Experience: {interview.experience}
        </p>

        <p className="text-green-400 mt-2 text-xl">
          Overall Score: {interview.score}/100
        </p>
      </div>

      {interview.questions.map((question: string, index: number) => (
        <div
          key={index}
          className="bg-slate-800 rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold mb-3">
            Question {index + 1}
          </h2>

          <p className="text-blue-400 mb-4">
            {question}
          </p>

          <p className="mb-4">
            <strong>Your Answer:</strong>
            <br />
            {interview.answers[index] || "No answer"}
          </p>

          <p className="text-yellow-300">
            Score: {feedback[index]?.score ?? "-"} /10
          </p>

          <p className="mt-3 text-gray-300">
            {feedback[index]?.feedback ?? "No feedback"}
          </p>
        </div>
      ))}

    </div>
  );
}