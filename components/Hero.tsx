"use client";

import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="text-center py-24 bg-slate-950 text-white">

      <h1 className="text-6xl font-bold">
        AI Interview Preparation
      </h1>

      <p className="mt-6 text-xl text-gray-400">
        Practice technical interviews with AI and improve every day.
      </p>

      <div className="mt-10">

        <button
          onClick={() => router.push("/interview")}
          className="bg-blue-600 px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Start Free
        </button>

      </div>

    </section>
  );
}