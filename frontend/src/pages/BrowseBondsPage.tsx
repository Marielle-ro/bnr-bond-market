import React from "react";
import { useAuth } from "../context/AuthContext";
import { Page, AppState } from "../App";
import { BondType } from "../types";

interface Props { navigate: (page: Page, extra?: Partial<AppState>) => void; }

const BrowseBondsPage: React.FC<Props> = ({ navigate }) => {
  const { bondTypes, user, logout } = useAuth();

  const handleSelect = (bond: BondType) => {
    navigate("investor/broker-select", { selectedBond: bond });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(user ? "investor/dashboard" : "home")}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-widest text-white">BNR</span>
              <span className="text-xs text-white/40 font-medium">Bond Marketplace</span>
            </div>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("investor/dashboard")}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                My Portfolio
              </button>
              <button onClick={() => { logout(); navigate("home"); }} className="text-sm text-white/40 hover:text-white transition-colors">
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("login/investor")}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm font-semibold rounded-md transition-colors"
            >
              Sign In to Invest
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            {bondTypes.length} Bond Types Available
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Available Bonds</h1>
          <p className="text-sm text-gray-400 mt-1">
            Select a bond type to view broker listings and invest.
          </p>
        </div>

        <div className="space-y-4">
          {bondTypes.filter((b) => b.isActive).map((bond) => (
            <div
              key={bond.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="flex items-stretch">
                {/* Left accent — coupon rate */}
                <div className="bg-slate-900 px-6 py-6 flex flex-col items-center justify-center text-center w-32 flex-shrink-0">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Rate</p>
                  <p className="text-2xl font-bold text-gold">{bond.couponRate}%</p>
                  <p className="text-xs text-white/40 mt-0.5">p.a.</p>
                </div>

                {/* Right content */}
                <div className="flex-1 px-6 py-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 mb-1">{bond.name}</h2>
                    <p className="text-sm text-gray-400">{bond.durationYears}-year government bond</p>
                    <div className="flex items-center gap-5 mt-3 text-xs">
                      <span>
                        <span className="text-gray-400">Min. Investment: </span>
                        <span className="font-semibold text-gray-900">RWF {bond.minInvestment.toLocaleString()}</span>
                      </span>
                      <span>
                        <span className="text-gray-400">Duration: </span>
                        <span className="font-semibold text-gray-900">{bond.durationYears} yrs</span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelect(bond)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-semibold rounded-md transition-colors flex-shrink-0 ml-6"
                  >
                    Select →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BrowseBondsPage;
