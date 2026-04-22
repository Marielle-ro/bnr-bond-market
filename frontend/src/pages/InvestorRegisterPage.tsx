import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Page } from "../App";

interface Props { navigate: (page: Page) => void; }

const InvestorRegisterPage: React.FC<Props> = ({ navigate }) => {
  const { registerInvestor } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", nationalId: "", payoutAccount: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { fullName, email, nationalId, payoutAccount, password, confirm } = form;
    if (!fullName || !email || !nationalId || !payoutAccount || !password || !confirm) { setError("All fields are required."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    const ok = registerInvestor({ fullName, email, nationalId, payoutAccount, password });
    if (ok) { setSuccess(true); setTimeout(() => navigate("login/investor"), 1500); }
    else setError("An account with this email already exists.");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-900 flex-col justify-between p-12">
        <div>
          <button onClick={() => navigate("home")} className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
            ← Back
          </button>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-4">BNR Bond Market</p>
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Put your savings<br />to work
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Earn fixed, government-backed returns through Rwanda's official bond market. Safe, transparent, and open to every citizen.
          </p>
          <div className="mt-10 space-y-3">
            {[
              "Fixed coupon rates — no surprises",
              "Zero default risk — backed by the government",
              "Regular interest payouts",
            ].map((point) => (
              <div key={point} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
                <span className="text-white/50 text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/20">© {new Date().getFullYear()} National Bank of Rwanda</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 bg-white flex items-center justify-center px-8 py-12 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Mobile back */}
          <button onClick={() => navigate("home")} className="lg:hidden text-sm text-gray-400 hover:text-gray-700 mb-8 flex items-center gap-1">
            ← Back to home
          </button>

          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              New Investor
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="text-sm text-gray-400 mt-1">A few details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {([
              { key: "fullName",      label: "Full Name",        type: "text",     ph: "Jean Pierre Habimana" },
              { key: "email",         label: "Email Address",    type: "email",    ph: "jp@gmail.com" },
              { key: "nationalId",    label: "National ID",      type: "text",     ph: "1199780012345678" },
              { key: "payoutAccount", label: "Payout Account",   type: "text",     ph: "1234567890" },
              { key: "password",      label: "Password",         type: "password", ph: "Min. 6 characters" },
              { key: "confirm",       label: "Confirm Password", type: "password", ph: "Repeat password" },
            ] as const).map(({ key, label, type, ph }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                <input
                  type={type} value={form[key]} onChange={set(key)} placeholder={ph}
                  className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>
            ))}

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-md px-3 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-md px-3 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                <p className="text-xs text-green-700">Account created — redirecting…</p>
              </div>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-sm font-semibold rounded-md transition-colors mt-2">
              Create Account
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-sm">
            <p className="text-gray-500">
              Already have an account?{" "}
              <button onClick={() => navigate("login/investor")} className="text-blue-600 font-semibold hover:underline">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorRegisterPage;
