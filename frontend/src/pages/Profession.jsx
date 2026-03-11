import { useState } from "react";
import { startSession } from "../api";

const professions = [
  { type: "student",    icon: "🎓", label: "Student",          sub: "Study material, JEE, NCERT" },
  { type: "business",   icon: "💼", label: "Business Owner",   sub: "Contracts, invoices, reports" },
  { type: "lawyer",     icon: "⚖️", label: "Lawyer",           sub: "Case files, legal documents" },
  { type: "doctor",     icon: "🏥", label: "Doctor",           sub: "Medical records, research" },
  { type: "researcher", icon: "🔬", label: "Researcher",       sub: "Papers, journals, data" },
  { type: "hr",         icon: "👥", label: "HR Professional",  sub: "Policies, offer letters" },
  { type: "finance",    icon: "🏦", label: "Finance",          sub: "Reports, statements" },
  { type: "other",      icon: "💡", label: "Other",            sub: "Any profession" },
];

export default function Profession({ token, user, onConfirm, onLogout, onBack }) {
  const initialType = null;
  const [selected, setSelected] = useState(initialType || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await startSession(selected);
      onConfirm(res.data.session_id, res.data.user_type);
    } catch (e) {
      setError("Failed to start session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Select Your Profession</h2>
        <p className="text-gray-400 text-sm mt-1">We'll customize the AI for your needs</p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {professions.map((p) => (
          <button
            key={p.type}
            onClick={() => setSelected(p.type)}
            className={`flex flex-col gap-1 p-4 rounded-2xl border transition text-left
              ${selected === p.type
                ? "border-blue-500 bg-blue-950"
                : "border-gray-700 bg-gray-900 hover:border-gray-500"}`}
          >
            <span className="text-2xl">{p.icon}</span>
            <p className="font-semibold text-sm text-white">{p.label}</p>
            <p className="text-gray-400 text-xs">{p.sub}</p>
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3 w-full max-w-md">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 transition"
        >
          ← Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selected || loading}
          className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
        >
          {loading ? "Starting..." : "Continue →"}
        </button>
      </div>
    </div>
  );
}