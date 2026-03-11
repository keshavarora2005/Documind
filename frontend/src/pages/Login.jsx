// ── Login.jsx ─────────────────────────────────────────────────────────────────
import { useState } from "react";
import { loginUser } from "../api";

export function Login({ onAuth, onSwitch, onBack }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser(form.email, form.password);
      onAuth(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm title="Welcome Back" subtitle="Login to DocuMind AI" form={form} setForm={setForm}
    onSubmit={handle} loading={loading} error={error} btnText="Login"
    switchText="Don't have an account?" switchBtn="Sign Up" onSwitch={onSwitch} onBack={onBack} />;
}

// ── Signup.jsx ────────────────────────────────────────────────────────────────
import { signupUser } from "../api";

export function Signup({ onAuth, onSwitch, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await signupUser(form.name, form.email, form.password);
      onAuth(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm title="Create Account" subtitle="Join DocuMind AI for free" form={form} setForm={setForm}
    onSubmit={handle} loading={loading} error={error} btnText="Create Account" showName
    switchText="Already have an account?" switchBtn="Login" onSwitch={onSwitch} onBack={onBack} />;
}

// ── Shared AuthForm component ─────────────────────────────────────────────────
function AuthForm({ title, subtitle, form, setForm, onSubmit, loading, error, btnText, showName, switchText, switchBtn, onSwitch, onBack }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {showName && (
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
              <input
                type="text" required placeholder="Keshav Kumar Arora"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition"
              />
            </div>
          )}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <input
              type="email" required placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Password</label>
            <input
              type="password" required placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 disabled:opacity-50 transition py-3 rounded-xl font-semibold text-sm"
          >
            {loading ? "Please wait..." : btnText}
          </button>
        </form>

        {/* Switch */}
        <p className="text-center text-gray-400 text-sm">
          {switchText}{" "}
          <button onClick={onSwitch} className="text-blue-400 hover:underline">{switchBtn}</button>
        </p>

        {/* Back */}
        <button onClick={onBack} className="text-center text-gray-600 text-xs hover:text-gray-400 transition">
          ← Back to home
        </button>
      </div>
    </div>
  );
}

export default Login;