import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Page } from "../App";

interface Props { navigate: (page: Page) => void; }

const BrokerRegisterPage: React.FC<Props> = ({ navigate }) => {
  const { registerBroker } = useAuth();
  const [form, setForm] = useState({
    companyName: "", email: "", contactPhone: "",
    collectionAccountName: "", collectionAccountNumber: "",
    password: "", confirm: "",
  });
  const [certFile, setCertFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCertFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { companyName, email, contactPhone, collectionAccountName, collectionAccountNumber, password, confirm } = form;
    if (!companyName || !email || !contactPhone || !collectionAccountName || !collectionAccountNumber || !password || !confirm) {
      setError("All fields are required."); return;
    }
    if (!certFile) { setError("Please upload your RDB certificate."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    const ok = registerBroker({
      companyName, email, contactPhone,
      collectionAccountName, collectionAccountNumber,
      password, rdbCertificateName: certFile.name,
    });
    if (ok) { setSuccess(true); setTimeout(() => navigate("login/broker"), 1500); }
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
          <p className="text-xs font-semibold tracking-widest text-gold uppercase mb-4">BNR Bond Market</p>
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Grow your<br />brokerage here
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            The only BNR-licensed platform for bond distribution in Rwanda. Reach investors, manage listings, and track every transaction — in one place.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Official BNR-approved distribution channel",
              "Full control over listings and fees",
              "Real-time client investment tracking",
            ].map((point) => (
              <div key={point} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-1.5" />
                <span className="text-white/50 text-sm">{point}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">You'll need</p>
            <ul className="text-xs text-white/40 space-y-2">
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gold inline-block flex-shrink-0" />Company email address</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gold inline-block flex-shrink-0" />RDB Certificate of Incorporation</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gold inline-block flex-shrink-0" />BNR collection account details</li>
            </ul>
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
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-md border border-yellow-100 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
              Broker Registration
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Register your brokerage</h1>
            <p className="text-sm text-gray-400 mt-1">Submitted for admin review</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {([
              { key: "companyName"             as const, label: "Company Name",          type: "text",     ph: "Kigali Capital Partners" },
              { key: "email"                   as const, label: "Company Email",         type: "email",    ph: "info@company.rw" },
              { key: "contactPhone"            as const, label: "Contact Phone",         type: "text",     ph: "+250 788 100 200" },
              { key: "collectionAccountName"   as const, label: "Collection Acct. Name", type: "text",     ph: "Company Name Ltd" },
              { key: "collectionAccountNumber" as const, label: "Collection Acct. No.",  type: "text",     ph: "4001-0023-8821" },
            ]).map(({ key, label, type, ph }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                <input
                  type={type} value={form[key]} onChange={set(key)} placeholder={ph}
                  className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>
            ))}

            {/* RDB Certificate Upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                RDB Certificate <span className="text-red-500 normal-case font-normal">(required)</span>
              </label>
              <div className={`relative rounded-md overflow-hidden border transition-colors ${certFile ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-blue-400"}`}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleCertChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="px-3.5 py-2.5 flex items-center gap-2.5 pointer-events-none">
                  {certFile ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-sm text-green-700 font-medium truncate">{certFile.name}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <span className="text-sm text-gray-400">Upload certificate (PDF, JPG, PNG)</span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">Your RDB certificate will be reviewed by the admin before approval.</p>
            </div>

            {([
              { key: "password" as const, label: "Password",         type: "password", ph: "Min. 6 characters" },
              { key: "confirm"  as const, label: "Confirm Password", type: "password", ph: "Repeat password" },
            ]).map(({ key, label, type, ph }) => (
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
                <p className="text-xs text-green-700">Registration submitted — redirecting…</p>
              </div>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-sm font-semibold rounded-md transition-colors mt-2">
              Submit Registration
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-sm">
            <p className="text-gray-500">
              Already registered?{" "}
              <button onClick={() => navigate("login/broker")} className="text-blue-600 font-semibold hover:underline">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerRegisterPage;
