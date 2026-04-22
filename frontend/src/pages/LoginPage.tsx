import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Page } from "../App";
import { Role } from "../types";

interface Props { navigate: (page: Page) => void; role: Role; }

const LoginPage: React.FC<Props> = ({ navigate, role }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const label = role === "INVESTOR" ? "Investor" : role === "BROKER" ? "Broker" : "Admin";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Both fields are required."); return; }
    const result = login(email.trim(), password.trim(), role);
    if (result === 'ok') {
      navigate(role === "INVESTOR" ? "investor/dashboard" : role === "BROKER" ? "broker/dashboard" : "admin/dashboard");
    } else if (result === 'pending') {
      setError("Your account is pending approval. Please wait for admin review.");
    } else if (result === 'suspended') {
      setError("Your account has been suspended. Contact BNR for assistance.");
    } else {
      setError("Invalid email or password.");
    }
  };

  const hints: Record<Role, { email: string; pass: string }> = {
    INVESTOR: { email: "jp@gmail.com",             pass: "investor123" },
    BROKER:   { email: "info@kigalicapital.rw",    pass: "broker123"   },
    ADMIN:    { email: "admin@bnrbondmarket.rw",    pass: "admin123"    },
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-900 flex-col justify-between p-12">
        <div>
          <button onClick={() => navigate("home")} className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
            ← Back
          </button>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-4">BNR Bond Market</p>
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            {label} Portal
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Sign in to continue.
          </p>
        </div>
        <p className="text-xs text-white/20">© {new Date().getFullYear()} National Bank of Rwanda</p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 bg-white flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile back button */}
          <button onClick={() => navigate("home")} className="lg:hidden text-sm text-gray-400 hover:text-gray-700 mb-8 flex items-center gap-1">
            ← Back to home
          </button>

          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              {label} Access
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="text-sm text-gray-400 mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email address</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                placeholder={hints[role].email}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-md px-3 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-sm font-semibold rounded-md transition-colors mt-2">
              Sign in to {label} Portal
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 bg-gray-50 border border-gray-100 rounded-md px-4 py-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Demo credentials</p>
            <p className="text-xs text-gray-500 font-mono">{hints[role].email}</p>
            <p className="text-xs text-gray-500 font-mono">{hints[role].pass}</p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-sm">
            {role === "INVESTOR" && (
              <p className="text-gray-500">No account? <button onClick={() => navigate("register/investor")} className="text-blue-600 font-semibold hover:underline">Create investor account</button></p>
            )}
            {role === "BROKER" && (
              <p className="text-gray-500">No account? <button onClick={() => navigate("register/broker")} className="text-blue-600 font-semibold hover:underline">Register brokerage</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
