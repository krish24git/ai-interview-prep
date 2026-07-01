"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6 bg-slate-900 text-white">
      <h1 className="text-2xl font-bold text-blue-500">
        AI Prep
      </h1>

      <div className="space-x-5">
        <Link
          href="/login"
          className="hover:text-blue-400"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}