"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Interview {
  _id: string;
  role: string;
  experience: string;
  score: number;
  createdAt: string;
}

export default function HistoryPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/interview", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setInterviews(data.interviews);
      }

      setLoading(false);
    };

    fetchInterviews();
  }, []);

  const deleteInterview = async (id: string) => {
    const token = localStorage.getItem("token");

    if (!confirm("Are you sure you want to delete this interview?")) return;

    const res = await fetch(`/api/interview/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      setInterviews((prev) => prev.filter((item) => item._id !== id));
    } else {
      alert("Failed to delete interview.");
    }
  };

  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Interview History
      </h1>

      {interviews.length === 0 ? (
        <p>No interviews found.</p>
      ) : (
        <div className="grid gap-5">
          {interviews.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl p-5 shadow"
            >
              <h2 className="text-xl font-semibold">
                {item.role}
              </h2>

              <p>Experience: {item.experience}</p>

              <p>Score: {item.score}</p>

              <p>{new Date(item.createdAt).toLocaleString()}</p>

              <div className="mt-4 flex gap-3">
                <Link
                  href={`/dashboard/${item._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View
                </Link>

                <button
                  onClick={() => deleteInterview(item._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}