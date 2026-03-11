import { useState } from "react";

const features = [
  { icon: "🎓", title: "Students", desc: "Upload NCERT, JEE material. Get instant explanations and practice questions." },
  { icon: "💼", title: "Business Owners", desc: "Chat with contracts, invoices and reports. Find any clause in seconds." },
  { icon: "⚖️", title: "Lawyers", desc: "Analyze case files and legal documents with precision." },
  { icon: "🏥", title: "Doctors", desc: "Extract insights from medical records and research papers." },
  { icon: "🔬", title: "Researchers", desc: "Summarize journals and extract key findings instantly." },
  { icon: "👥", title: "HR Professionals", desc: "Navigate policies, offer letters and employee documents." },
];

const steps = [
  { step: "01", title: "Sign Up Free", desc: "Create your account in 30 seconds" },
  { step: "02", title: "Choose Your Role", desc: "Tell us who you are — we customize the AI for you" },
  { step: "03", title: "Upload Documents", desc: "Upload any PDF — contracts, books, reports" },
  { step: "04", title: "Ask Anything", desc: "Get instant, accurate answers from your documents" },
];

export default function Landing({ isLoggedIn, user, onGetStarted, onLogout }) {
  const [dropdown, setDropdown] = useState(false);
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">📄 DocuMind <span className="text-blue-400">AI</span></h1>
        <div className="flex items-center gap-3">
          {isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdown(d => !d)}
                className="flex items-center gap-2 bg-gray-800 border border-gray-700 hover:border-blue-500 transition px-4 py-2 rounded-xl text-sm"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-white">{user.name}</span>
                <span className="text-gray-400">{dropdown ? "▲" : "▼"}</span>
              </button>
              {dropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-10">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-white text-sm font-semibold">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setDropdown(false); onLogout(); }}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800 transition rounded-b-xl"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : null}
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-500 transition px-5 py-2 rounded-xl text-sm font-semibold"
          >
            {isLoggedIn ? "Go to App →" : "Get Started Free"}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 py-24 gap-6">
        <h1 className="text-5xl font-extrabold text-white max-w-3xl leading-tight">
          Stop Searching.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Start Asking.
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl">
          Upload any document. Ask anything in plain English.
          Get instant, accurate answers — powered by AI.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition px-8 py-4 rounded-2xl text-lg font-bold"
          >
            Try Free — No Credit Card
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">How It Works</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="flex flex-col gap-3 bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <span className="text-blue-400 font-extrabold text-2xl">{s.step}</span>
              <p className="font-semibold text-white">{s.title}</p>
              <p className="text-gray-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who is it for */}
      <section className="px-8 py-16 bg-gray-900">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Built For Everyone</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="bg-gray-950 border border-gray-800 hover:border-blue-500 transition rounded-2xl p-5">
              <p className="text-3xl mb-3">{f.icon}</p>
              <p className="font-semibold text-white mb-1">{f.title}</p>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center text-center px-4 py-24 gap-6">
        <h2 className="text-4xl font-bold text-white">Ready to Stop Wasting Time?</h2>
        <p className="text-gray-400">Join hundreds of professionals using DocuMind AI</p>
        <button
          onClick={onGetStarted}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition px-8 py-4 rounded-2xl text-lg font-bold"
        >
          Get Started Free →
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-800 text-gray-600 text-sm">
        Built with ❤️ by Keshav Kumar Arora 🚀
      </footer>
    </div>
  );
}