import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold">Krish Kakkar</h2>
          <p className="text-gray-400 text-sm">
            AI Interview Prep Platform
          </p>
        </div>

        <div className="flex gap-6">
          <Link
            href="https://github.com/krish24git"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            GitHub
          </Link>

          <Link
            href="https://www.linkedin.com/in/krish-kakkar-651788289"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}