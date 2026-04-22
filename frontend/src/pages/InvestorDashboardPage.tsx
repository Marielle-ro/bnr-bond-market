import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Page } from "../App";
import { Investment } from "../types";

interface Props { navigate: (page: Page) => void; }

const PayoutPopup: React.FC<{ inv: Investment; onClose: () => void }> = ({ inv, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-80 p-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Next Payout</p>
          <h3 className="text-sm font-bold text-gray-900">{inv.bondName}</h3>
        </div>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-600 text-xl leading-none mt-0.5">×</button>
      </div>
      <div className="bg-blue-50 rounded-lg p-4 mb-4 text-center">
        <p className="text-xs text-blue-500 mb-1">Expected Interest</p>
        <p className="text-2xl font-bold text-gold">RWF {inv.expectedInterestAmount.toLocaleString()}</p>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Payout Date</span>
          <span className="font-semibold text-gray-900">{inv.nextPayoutDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Rate</span>
          <span className="font-semibold text-blue-600">{inv.interestRate}% p.a.</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Duration</span>
          <span className="font-semibold text-gray-900">{inv.durationYears} years</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Broker</span>
          <span className="font-semibold text-gray-900">{inv.brokerCompanyName}</span>
        </div>
      </div>
    </div>
  </div>
);

const InvestorDashboardPage: React.FC<Props> = ({ navigate }) => {
  const { user, getUserInvestments, logout } = useAuth();
  const [popupInv, setPopupInv] = useState<Investment | null>(null);

  if (!user || user.role !== "INVESTOR") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please sign in as an investor.</p>
          <button onClick={() => navigate("login/investor")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm rounded-md">Sign In</button>
        </div>
      </div>
    );
  }

  const investments = getUserInvestments((user as any).id).slice().reverse();
  const totalInvested = investments.reduce((s, i) => s + i.amountInvested, 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 fixed h-screen flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase">BNR Bond Market</p>
          <p className="text-sm font-bold text-white mt-1 truncate">{(user as any).fullName}</p>
        </div>
        <nav className="py-4 flex-1">
          <button
            className="w-full text-left px-5 py-2.5 text-sm border-l-2 border-gold bg-white/5 font-semibold text-white"
          >
            My Portfolio
          </button>
          <button
            onClick={() => navigate("investor/browse")}
            className="w-full text-left px-5 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            Buy Bonds
          </button>
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/30 truncate mb-2">{(user as any).email}</p>
          <button
            onClick={() => { logout(); navigate("home"); }}
            className="w-full text-left text-sm text-white/40 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-56 flex-1">
        {/* Topbar */}
        <header className="bg-slate-800 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-lg font-bold text-white">My Portfolio</h1>
          <button
            onClick={() => navigate("investor/browse")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold rounded-md transition-colors"
          >
            + Buy Bonds
          </button>
        </header>

        <main className="px-8 py-8 space-y-6">
          {/* Portfolio summary card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 px-8 py-6">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Total Amount Invested in Bonds</p>
              <p className="text-4xl font-bold text-gold">{totalInvested > 0 ? `RWF ${totalInvested.toLocaleString()}` : "RWF 0"}</p>
            </div>
            <div className="px-8 py-4 bg-white flex items-center justify-between border-t border-gray-100">
              <p className="text-sm text-gray-400">{investments.length} active bond{investments.length !== 1 ? "s" : ""} in your portfolio</p>
              {investments.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Active
                </span>
              )}
            </div>
          </div>

          {/* Investments */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Investments</h2>
            <span className="text-xs text-gray-400">{investments.length} investment{investments.length !== 1 ? "s" : ""}</span>
          </div>

          {investments.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-500 text-xl">+</span>
              </div>
              <p className="text-gray-500 mb-4 text-sm">No investments yet. Start building your portfolio.</p>
              <button onClick={() => navigate("investor/browse")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm rounded-md font-semibold transition-colors">
                Browse Bonds
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {investments.map((inv) => (
                <div key={inv.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="flex items-start justify-between p-5">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-sm">{inv.bondName}</h3>
                        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md font-medium">{inv.durationYears}yr</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-mono">{inv.bondNumber}</span>
                      </div>
                      <div className="flex items-center gap-5 text-xs text-gray-400 flex-wrap">
                        <span>Purchased <span className="text-gray-700 font-medium">{inv.purchaseDate}</span></span>
                        <span>Via <span className="text-gray-700 font-medium">{inv.brokerCompanyName}</span></span>
                      </div>
                    </div>
                    <div className="text-right ml-6 flex-shrink-0 space-y-2">
                      <p className="text-lg font-bold text-gray-900">RWF {inv.amountInvested.toLocaleString()}</p>
                      <p className="text-xs font-semibold text-blue-600">{inv.interestRate}% p.a.</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Next payout: <span className="text-gray-600 font-medium">{inv.nextPayoutDate}</span></span>
                    <button
                      onClick={() => setPopupInv(inv)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 bg-white px-3 py-1.5 rounded-md transition-colors"
                    >
                      See Next Payout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {popupInv && <PayoutPopup inv={popupInv} onClose={() => setPopupInv(null)} />}
    </div>
  );
};

export default InvestorDashboardPage;
