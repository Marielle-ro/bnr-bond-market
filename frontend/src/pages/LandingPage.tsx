import React from "react";
import { Page } from "../App";

interface Props { navigate: (page: Page) => void; }

const LandingPage: React.FC<Props> = ({ navigate }) => (
  <div className="min-h-screen bg-slate-900 text-white">

    {/* ── Nav ── */}
    <header className="border-b border-white/10 sticky top-0 z-40 bg-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold tracking-widest text-white">BNR</span>
          <span className="text-xs text-white/40 font-medium tracking-widest uppercase mt-0.5">Bond Market</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("login/investor")}   className="text-sm text-white/60 hover:text-white px-3 py-1.5 transition-colors">Investor Login</button>
          <button onClick={() => navigate("login/broker")}     className="text-sm text-white/60 hover:text-white px-3 py-1.5 transition-colors">Broker Login</button>
          <button onClick={() => navigate("register/broker")}  className="text-sm bg-gold/20 hover:bg-gold/30 text-gold border border-gold/40 px-4 py-1.5 rounded-md font-semibold transition-colors">Register as Broker</button>
          <button onClick={() => navigate("login/admin")}      className="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-md transition-colors">Admin</button>
        </div>
      </div>
    </header>

    {/* ── Hero ── */}
    <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 overflow-hidden">
      {/* Decorative bond image — right half, all edges fading into background */}
      <div
        className="absolute right-0 top-0 w-2/5 h-full pointer-events-none select-none"
        style={{
          maskImage: "radial-gradient(ellipse 75% 80% at 62% 50%, black 0%, black 25%, rgba(0,0,0,0.6) 48%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 80% at 62% 50%, black 0%, black 25%, rgba(0,0,0,0.6) 48%, transparent 72%)",
        }}
      >
        <img
          src="/BONDS IMAGE.webp"
          alt=""
          className="w-full h-full object-cover object-center opacity-30"
          draggable={false}
        />
      </div>

      <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-md mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
        Republic of Rwanda — National Bank
      </div>
      <h1 className="text-5xl font-bold leading-snug mb-5 max-w-xl">
        Government Bond<br />
        <span className="text-gold">Purchase Platform</span>
      </h1>
      <p className="text-white/50 text-xl mb-10 max-w-md leading-relaxed">
        Invest directly in Rwanda's development. Secure, transparent bonds issued by the National Bank of Rwanda through licensed brokers.
      </p>
      <div className="flex gap-3">
        <button onClick={() => navigate("register/investor")} className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 text-sm font-semibold rounded-md transition-colors">
          Open Investor Account
        </button>
        <button onClick={() => navigate("investor/browse")} className="border border-white/20 hover:border-white/40 text-white/70 hover:text-white px-7 py-3 text-sm font-medium rounded-md transition-colors">
          Browse Bonds →
        </button>
      </div>
    </section>

    {/* ── Stats strip ── */}
    <section className="border-y border-white/10 bg-white/5">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-3 divide-x divide-white/10">
        {[
          { label: "Min. Investment",      value: "RWF 100,000" },
          { label: "Bond Types Available", value: "3" },
          { label: "Licensed Brokers",     value: "2 Active" },
        ].map((s) => (
          <div key={s.label} className="px-8 first:pl-0 last:pr-0">
            <p className="text-sm text-white/40 uppercase tracking-widest mb-2">{s.label}</p>
            <p className="text-3xl font-bold text-gold">{s.value}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── Feature cards ── */}
    <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-3 gap-5">
      {[
        { title: "Fixed Returns",    desc: "Lock in government-backed coupon rates from 7.8% to 9.2% per annum." },
        { title: "Licensed Brokers", desc: "All brokers are BNR-verified. Your investment is channelled through regulated entities." },
        { title: "Transparent Fees", desc: "Broker fees are shown upfront before you commit. No hidden charges." },
      ].map((f) => (
        <div key={f.title} className="bg-white/5 border border-white/10 p-6 rounded-md">
          <div className="w-8 h-0.5 bg-blue-500 mb-4" />
          <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
          <p className="text-base text-white/40 leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </section>

    {/* ── CTA section ── */}
    <section className="border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 gap-6">
        <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-md">
          <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-3">For Investors</p>
          <h2 className="text-xl font-bold text-white mb-3">Start investing in minutes</h2>
          <p className="text-white/40 text-base mb-6 leading-relaxed">Register with your National ID, choose a licensed broker, and begin building your bond portfolio.</p>
          <button onClick={() => navigate("register/investor")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold rounded-md transition-colors">
            Register as Investor
          </button>
        </div>
        <div className="bg-gold/5 border border-gold/20 p-8 rounded-md">
          <p className="text-xs font-semibold tracking-widest text-gold uppercase mb-3">For Brokers</p>
          <h2 className="text-xl font-bold text-white mb-3">List bonds for your clients</h2>
          <p className="text-white/40 text-base mb-6 leading-relaxed">Apply for broker status, set your fee, and manage your client investments through the platform.</p>
          <button onClick={() => navigate("register/broker")} className="bg-gold hover:bg-yellow-600 text-slate-900 px-5 py-2.5 text-sm font-bold rounded-md transition-colors">
            Register as Broker →
          </button>
        </div>
      </div>
    </section>

    {/* ── Footer ── */}
    <footer className="border-t border-white/10 py-6">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <span className="text-xs text-white/20">© {new Date().getFullYear()} National Bank of Rwanda. Bond Market Platform.</span>
        <div className="flex gap-6 text-xs text-white/20">
          <button onClick={() => navigate("login/investor")} className="hover:text-white/50 transition-colors">Investor Portal</button>
          <button onClick={() => navigate("login/broker")}   className="hover:text-white/50 transition-colors">Broker Portal</button>
          <button onClick={() => navigate("login/admin")}    className="hover:text-white/50 transition-colors">Admin</button>
        </div>
      </div>
    </footer>
  </div>
);

export default LandingPage;
