"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("interviewId");
    localStorage.removeItem("questions");
    localStorage.removeItem("report");
    localStorage.removeItem("role");
    localStorage.removeItem("experience");
    localStorage.removeItem("difficulty");

    setLoggedIn(false);

    window.location.href = "/";
  };

  return (
    <nav className="flex justify-between items-center px-10 py-6 bg-slate-900 text-white">
      <Link href="/" className="text-2xl font-bold text-blue-500">
        AI Prep
      </Link>

      <div className="flex items-center gap-5">
        <Link href="/" className="hover:text-blue-400">
          Home
        </Link>

        {loggedIn && (
          <>
            <Link
              href="/dashboard"
              className="hover:text-blue-400"
            >
              Dashboard
            </Link>

            <Link
              href="/history"
              className="hover:text-blue-400"
            >
              📜 Interview History
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}

        {!loggedIn && (
          <>
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
          </>
        )}
      </div>
    </nav>
  );
}