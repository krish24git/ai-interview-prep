"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Interview {
  _id: string;
  role: string;
  experience: string;
  score: number;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      router.push("/login");
      return;
    }

    fetch("/api/interview", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInterviews(data.interviews);
        } else {
          alert(data.message);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        Interview History
      </h1>

      {interviews.length === 0 ? (
        <p>No interviews found.</p>
      ) : (
        interviews.map((item) => (
          <div
            key={item._id}
            className="bg-slate-800 rounded-xl p-6 mb-6"
          >
            <h2 className="text-2xl font-bold">
              {item.role}
            </h2>

            <p className="text-gray-300 mt-2">
              Experience: {item.experience}
            </p>

            <p className="text-green-400 mt-2">
              Score: {item.score}/100
            </p>

            <p className="text-gray-400 mt-2">
              {new Date(item.createdAt).toLocaleString()}
            </p>

            <div className="mt-4 flex gap-4">

              <button
                onClick={() => router.push(`/dashboard/${item._id}`)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                View
              </button>

              <button
                onClick={async () => {
                  const confirmDelete = confirm(
                    "Are you sure you want to delete this interview?"
                  );

                  if (!confirmDelete) return;

                  const token = localStorage.getItem("token");

                  const res = await fetch(`/api/interview/${item._id}`, {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });

                  const data = await res.json();

                  if (data.success) {
                    setInterviews((prev) =>
                      prev.filter((i) => i._id !== item._id)
                    );
                  } else {
                    alert(data.message);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Delete
              </button>

            </div>
          </div>
        ))
      )}
    </div>
  );
}