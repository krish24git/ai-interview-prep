"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("report");

    if (!stored) return;

    setReport(JSON.parse(stored));
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading Report...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        AI Interview Report
      </h1>

      <div className="bg-slate-800 rounded-xl p-6 mb-8">

        <h2 className="text-2xl text-green-400">
          Overall Score
        </h2>

        <p className="text-5xl font-bold mt-4">
          {report.overallScore}/100
        </p>

      </div>

      {report.results.map((item: any, index: number) => (
        <div
          key={index}
          className="bg-slate-800 p-6 rounded-xl mb-6"
        >
          <h2 className="text-xl font-bold mb-3">
            Question {index + 1}
          </h2>

          <p className="mb-4 text-blue-400">
            {item.question}
          </p>

          <p className="mb-4">
            <strong>Your Answer:</strong>
            <br />
            {item.answer}
          </p>

          <p className="text-green-400">
            Score : {item.score}/10
          </p>

          <p className="mt-3 text-gray-300">
            {item.feedback}
          </p>

        </div>
      ))}

    </div>
  );
}