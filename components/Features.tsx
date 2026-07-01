export default function Features() {
  return (
    <section className="grid md:grid-cols-3 gap-8 p-12 bg-slate-900 text-white">

      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold">
          AI Questions
        </h2>

        <p className="mt-4">
          Generate unlimited interview questions.
        </p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold">
          AI Feedback
        </h2>

        <p className="mt-4">
          Receive detailed performance analysis.
        </p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold">
          Progress Tracking
        </h2>

        <p className="mt-4">
          Monitor your interview performance.
        </p>
      </div>

    </section>
  );
}