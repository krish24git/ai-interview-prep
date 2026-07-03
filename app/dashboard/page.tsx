"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Interview {
  _id: string;
  role: string;
  experience: string;
  score: number;
  createdAt: string;
  status?: string;
}

export default function Dashboard() {
  const router = useRouter();

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
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

  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      const matchSearch = item.role
        .toLowerCase()
        .includes(search.toLowerCase());

      const status =
        item.score > 0 ? "Completed" : "Pending";

      const matchFilter =
        filter === "All" || filter === status;

      return matchSearch && matchFilter;
    });
  }, [interviews, search, filter]);

  const totalInterviews = interviews.length;

  const completedInterviews =
    interviews.filter((i) => i.score > 0).length;

  const averageScore =
    completedInterviews === 0
      ? 0
      : Math.round(
          interviews
            .filter((i) => i.score > 0)
            .reduce((sum, i) => sum + i.score, 0) /
            completedInterviews
        );

  const bestScore =
    interviews.length === 0
      ? 0
      : Math.max(...interviews.map((i) => i.score));

  const chartData = {
    labels: interviews.map(
      (_, index) => `Interview ${index + 1}`
    ),

    datasets: [
      {
        label: "Interview Score",

        data: interviews.map((i) => i.score),

        borderColor: "#3b82f6",

        backgroundColor: "#3b82f6",

        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">

        <div className="text-center">

          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-500 mx-auto"></div>

          <p className="mt-6 text-white text-xl">
            Loading Dashboard...
          </p>

        </div>

      </div>
    );
  }
  return (
  <div className="min-h-screen bg-slate-900 text-white p-8">

    {/* Header */}

    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10">

      <div>

        <h1 className="text-4xl font-bold">
          AI Interview Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Track your interview performance and progress.
        </p>

      </div>

      <div className="flex gap-4 mt-6 md:mt-0">

        <button
          onClick={() => router.push("/interview")}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
        >
          + New Interview
        </button>

        <button
          onClick={() => router.push("/history")}
          className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg"
        >
          History
        </button>

      </div>

    </div>

    {/* Statistics */}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

      <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

        <p className="text-gray-400">
          Total Interviews
        </p>

        <h2 className="text-4xl font-bold mt-3">
          {totalInterviews}
        </h2>

      </div>

      <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

        <p className="text-gray-400">
          Completed
        </p>

        <h2 className="text-4xl font-bold mt-3 text-green-400">
          {completedInterviews}
        </h2>

      </div>

      <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

        <p className="text-gray-400">
          Average Score
        </p>

        <h2 className="text-4xl font-bold mt-3 text-blue-400">
          {averageScore}%
        </h2>

      </div>

      <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

        <p className="text-gray-400">
          Best Score
        </p>

        <h2 className="text-4xl font-bold mt-3 text-yellow-400">
          {bestScore}%
        </h2>

      </div>

    </div>

    {/* Performance Chart */}

    <div className="bg-slate-800 rounded-xl p-6 mb-10 shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        Performance Overview
      </h2>

      <Line data={chartData} />

    </div>

    {/* Search & Filter */}

    <div className="flex flex-col lg:flex-row gap-4 mb-8">

      <input
        type="text"
        placeholder="🔍 Search by role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 bg-slate-800 rounded-lg px-5 py-3 outline-none border border-slate-700 focus:border-blue-500"
      />

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="bg-slate-800 rounded-lg px-5 py-3 border border-slate-700"
      >
        <option>All</option>
        <option>Completed</option>
        <option>Pending</option>
      </select>

    </div>

    {/* Empty State */}

    {filteredInterviews.length === 0 ? (

      <div className="bg-slate-800 rounded-xl py-24 text-center shadow-lg">

        <div className="text-7xl">
          🤖
        </div>

        <h2 className="text-3xl font-bold mt-6">
          No Interviews Found
        </h2>

        <p className="text-gray-400 mt-4">
          Start your first AI interview and improve your skills.
        </p>

        <button
          onClick={() => router.push("/interview")}
          className="mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg"
        >
          Start Interview
        </button>

      </div>

    ) : (

      <div className="space-y-6">
      {filteredInterviews.map((item) => {
  const status = item.score > 0 ? "Completed" : "Pending";

  return (
    <div
      key={item._id}
      className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 hover:border-blue-500 transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">

        {/* Left */}

        <div>

          <h2 className="text-2xl font-bold">
            {item.role}
          </h2>

          <p className="text-gray-400 mt-2">
            Experience: {item.experience}
          </p>

          <p className="text-gray-500 mt-2 text-sm">
            {new Date(item.createdAt).toLocaleString()}
          </p>

        </div>

        {/* Right */}

        <div className="mt-6 lg:mt-0 text-right">

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              status === "Completed"
                ? "bg-green-600"
                : "bg-yellow-600"
            }`}
          >
            {status}
          </span>

          <h2 className="text-5xl font-bold text-blue-400 mt-4">
            {item.score}%
          </h2>

        </div>

      </div>

      <div className="flex flex-wrap gap-4 mt-8">

        <button
          onClick={() =>
            router.push(`/dashboard/${item._id}`)
          }
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
        >
          👁 View Report
        </button>

        <button
          onClick={async () => {
            const confirmDelete = confirm(
              "Delete this interview?"
            );

            if (!confirmDelete) return;

            const token = localStorage.getItem("token");

            const res = await fetch(
              `/api/interview/${item._id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const data = await res.json();

            if (data.success) {
              setInterviews((prev) =>
                prev.filter(
                  (i) => i._id !== item._id
                )
              );
            } else {
              alert(data.message);
            }
          }}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg"
        >
          🗑 Delete
        </button>

      </div>
    </div>
  );
})}

      </div>
    )}

    {/* Recent Activity */}

    {interviews.length > 0 && (
      <div className="bg-slate-800 rounded-xl p-6 mt-10">

        <h2 className="text-2xl font-bold mb-6">
          Recent Activity
        </h2>

        <div className="space-y-4">

          {interviews.slice(0, 5).map((item) => (

            <div
              key={item._id}
              className="flex justify-between border-b border-slate-700 pb-3"
            >

              <div>

                <p className="font-semibold">
                  {item.role}
                </p>

                <p className="text-gray-400 text-sm">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>

              </div>

              <div className="text-right">

                <p className="text-blue-400 font-bold">
                  {item.score}%
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>
    )}

  </div>
);
}